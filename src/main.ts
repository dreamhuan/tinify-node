import tinify from "tinify";
import "dotenv/config";
import fs from "fs";
import path from "path";

const KEY = process.env.API_KEY || "";
const imgPath = process.env.IMG_SRC || "";
const imgFold = process.env.IMG_TINY || "";
const isTest = process.env.TEST === "1";
tinify.key = KEY;

const foldPath = path.resolve(imgPath, imgFold);
export async function createFold() {
  await fs.promises.mkdir(foldPath, { recursive: true });
}

export async function getImgs() {
  // 获取imgPath下所有图片
  const files = await fs.promises.readdir(imgPath);
  const imgs = files.filter(
    (file) => file.endsWith(".png") || file.endsWith(".jpg")
  );
  console.log(imgs);
  return imgs;
}

/**
 * 读取{MG_SRC}下的图片，tinypng后放在这个目录下的{IMG_TINY}文件夹里
 */
export async function minify(imgName: string) {
  const filePath = path.resolve(imgPath, imgName);
  const distPath = path.resolve(foldPath, imgName);
  // 判断文件是否存在
  if (fs.existsSync(distPath)) {
    console.log("file exists ", distPath, " skip");
    return;
  }
  console.log("start minify", imgName);
  const source = tinify.fromFile(filePath);
  await source.toFile(distPath);
  console.log("finish", distPath);
}

/**
 * 读取{IMG_SRC}下的图片，转成webp并压缩后放在这个目录下的{IMG_TINY}文件夹里
 */
export async function toWebp(imgName: string) {
  const filePath = path.resolve(imgPath, imgName);
  const newName = imgName.split(".")[0] + ".webp";
  const distPath = path.resolve(foldPath, newName);
  // 判断文件是否存在
  if (fs.existsSync(distPath)) {
    console.log("file exists ", distPath, " skip");
    return;
  }
  console.log("start convert", imgName);
  const source = tinify.fromFile(filePath);
  const converted = source.convert({ type: "image/webp" });
  await converted.toFile(distPath);
  console.log("finish", distPath);
}

export async function processing(type: "webp" | "minify") {
  await createFold();
  const imgs = await getImgs();
  for (let imgName of imgs) {
    switch (type) {
      case "minify":
        await minify(imgName);
        break;
      case "webp":
        await toWebp(imgName);
        break;
      default:
        break;
    }
    if (isTest) {
      return;
    }
  }
}
