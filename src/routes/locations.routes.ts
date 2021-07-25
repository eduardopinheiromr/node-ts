import { Router } from "express";
import knex from "../database/connection";
import multer from "multer";
import multerConfig from "../config/multer";
import { celebrate, Joi } from "celebrate";

const locationsRouter = Router();

const upload = multer(multerConfig);

locationsRouter.get("/", async (req, res) => {
  const { city, uf, items } = req.query;

  if (city && uf && items) {
    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    const locations = await knex("locations")
      .join("location_items", "locations.id", "=", "location_items.location_id")
      .whereIn("location_items.item_id", parsedItems)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("locations.*");

    return res.json(locations);
  }

  const locations = await knex("locations").join(
    "location_items",
    "locations.id",
    "=",
    "location_items.location_id"
  );

  res.json(locations);
});

locationsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  const location = await knex("locations").where("id", id).first();

  if (!location) {
    return res.status(404).json({ message: "Location not found" });
  }

  const items = await knex("items")
    .join("location_items", "items.id", "=", "location_items.item_id")
    .where("location_items.location_id", id)
    .select("items.title");

  res.json({ location, items });
});

locationsRouter.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.string().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      city: Joi.string().required(),
      uf: Joi.string().required().max(2),
      items: Joi.array().required(),
    }),
  }),
  async (req, res) => {
    const { name, email, whatsapp, latitude, longitude, city, uf, items } =
      req.body;

    const location = {
      image: "fake-image.jpg",
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      createdAt: new Date().toLocaleString(),
    };

    // ROLLBACK OPERATIONS IF ANY ERROR
    const transaction = await knex.transaction();

    const newIds = await transaction("locations").insert(location);

    const location_id = newIds[0];

    const existentItems = await transaction("items").whereIn("id", items);

    if (existentItems.length < items.length) {
      const allExistentIds = existentItems.map(
        (item: { id: number; title: string; image: string }) => item.id
      );

      const notFoundIds = items.filter(
        (item: number) => !allExistentIds.includes(item)
      );

      return res
        .status(400)
        .json({ message: "Item ID's not found", notFoundIds });
    }

    const locationItems = items.map((item_id: number) => {
      return { item_id, location_id };
    });

    await transaction("location_items").insert(locationItems);

    await transaction.commit();
    // END ROLLBACK

    return res.json({ id: location_id, ...location });
  }
);

locationsRouter.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;

  const image = req.file?.filename;

  const location = await knex("locations").where("id", id).first();

  if (!location) {
    res.status(404).json({ message: "Location not found" });
  }

  const locationUpdated = { ...location, image };

  await knex("locations").update(locationUpdated).where("id", id);

  return res.json(locationUpdated);
});

export default locationsRouter;
