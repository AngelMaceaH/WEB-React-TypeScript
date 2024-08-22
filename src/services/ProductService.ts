import axios from "axios";
import {
  DraftProductSchema,
  Product,
  ProductSchema,
  ProductsSchema,
} from "../types";
//, pipe, transform, number, string, boolean
import { safeParse} from "valibot";
import { toBoolean } from "../utils";
type ProductData = {
  [k: string]: FormDataEntryValue;
};
export async function addProduct(data: ProductData) {
  try {
    const result = safeParse(DraftProductSchema, {
      name: data.name,
      price: +data.price,
    });
    if (!result.success) {
      throw new Error("Datos no validos");
    }
    const url = `${import.meta.env.VITE_API_URL}/api/productos/`;
    await axios.post(url, {
      name: result.output.name,
      price: result.output.price,
    });
  } catch (err) {
    console.log(err);
  }
}
export async function getProducts() {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/productos/`;
    const { data } = await axios.get(url);
    const result = safeParse(ProductsSchema, data.data);
    if (!result.success) {
      throw new Error("Datos no validos");
    } else {
      return result.output;
    }
  } catch (err) {
    console.log(err);
  }
}
export async function getProductById(id: Product["id"]) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/productos/${id}`;
    const { data } = await axios.get(url);
    const result = safeParse(ProductSchema, data.data);
    if (!result.success) {
      throw new Error("Datos no validos");
    } else {
      return result.output;
    }
  } catch (err) {
    console.log(err);
  }
}
export async function editProduct(id: Product["id"], data: ProductData) {
  try {
   /* const NumberSchema = pipe(string(), transform(Number), number());
    const AvailabilitySchema = pipe(
      string(),
      transform((value) => {
        if (value === "true") return true;
        if (value === "false") return false;
        throw new Error("Invalid boolean value");
      }),
      boolean()
    );*/
    const result = safeParse(ProductSchema, {
      id,
      name: data.name,
      price: data.price,
      availability: toBoolean(data.availability.toString()),
    });
    if (!result.success) {
      throw new Error("Datos no validos");
    }
    const url = `${import.meta.env.VITE_API_URL}/api/productos/${id}`;
    await axios.put(url, {
      name: result.output.name,
      price: result.output.price,
    });
    if (result.success) {
      const url = `${import.meta.env.VITE_API_URL}/api/productos/${id}`;
      await axios.put(url, result.output);
    }
  } catch (err) {
    console.log(err);
  }
}
export async function deleteProduct(id: Product["id"]) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/productos/${id}`;
    await axios.delete(url);
  } catch (err) {
    console.log(err);
  }
}
export async function toggleAvailability(id: Product["id"]) {
  try {
    //OBTENIENDO AVAILABILITY
    const url1 = `${import.meta.env.VITE_API_URL}/api/productos/${id}`;
    const { data } = await axios.get(url1);
    const result = safeParse(ProductSchema, data.data);
    if (!result.success) {
      throw new Error("Datos no validos");
    } else {
      //CAMBIANDO
      const newAvailability = !result.output.availability;
      const url2 = `${import.meta.env.VITE_API_URL}/api/productos/${id}`;
      await axios.patch(url2, {
        availability: newAvailability,
      });
    }
  } catch (err) {
    console.log(err);
  }
}
