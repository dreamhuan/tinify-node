/**
 * @description: 根据{IMG_SRC}配置下的路径，从{WEBP_SRC}查找同名webp文件，并复制到{IMG_SRC}/webp路径下
 */
import { existsSync, mkdirSync, readdir, copyFileSync } from "fs";
import { join, extname, basename } from "path";
import "dotenv/config";

// 源图片存储路径（.webp 文件所在的目录，这个变量{WEBP_SRC}需要加到.env里）
const sourcePath = process.env.WEBP_SRC || "";
// 目标路径
const currentDir = process.env.IMG_SRC || "";
// 目标复制路径
const targetPath = join(currentDir, "webp");

// 确保目标目录存在
if (!existsSync(targetPath)) {
  mkdirSync(targetPath);
}

// 读取当前目录下的所有文件
readdir(currentDir, (err, files) => {
  if (err) {
    console.error("无法读取当前目录:", err);
    return;
  }

  // 过滤出 .jpg 和 .png 文件，并提取不带后缀的文件名
  const baseNames = files
    .filter((file) => [".jpg", ".png"].includes(extname(file).toLowerCase()))
    .map((file) => basename(file, extname(file))); // 去除后缀得到基础文件名

  // 遍历每个基础文件名，查找 .webp 文件
  baseNames.forEach((baseName) => {
    const webpFileName = `${baseName}.webp`;
    const sourceFilePath = join(sourcePath, webpFileName);
    const targetFilePath = join(targetPath, webpFileName);

    if (existsSync(sourceFilePath)) {
      copyFileSync(sourceFilePath, targetFilePath);
      console.log(`已复制: ${webpFileName}`);
    } else {
      console.log(`未找到: ${webpFileName}`);
    }
  });
});
