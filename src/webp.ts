/**
 * 传统图片转为wbep（不通过tinypng）
 * 1. cwebp, Google提供的官方工具，能将许多格式的图片转化为WebP格式,可以在命令行中使用它
 *    cwebp -q 80 input.jpg -o output.webp
 *
 * 2. Imagemagick, 功能强大的图像处理库，可以通过命令行工具或者编程API来使用
 *    convert input.jpg output.webp
 *
 * 这里仅使用cwebp，注意需要自行全局安装cwebp：https://developers.google.com/speed/webp/docs/precompiled?hl=zh-cn
 * 将A目录下所有的jpg、png转为webp放到B目录下
 */
import { exec } from "child_process";
import * as fs from "fs/promises";
import * as path from "path";
import { promisify } from "util";

// 将 exec 转换为基于 Promise 的函数，以便使用 async/await
const execPromise = promisify(exec);

// cwebp 转换的质量参数 (0-100)，80 是一个很好的平衡点
const WEBP_QUALITY = 80;

/**
 * 检查 cwebp 命令是否存在于系统 PATH 中
 */
async function checkCwebpAvailability(): Promise<void> {
  try {
    await execPromise("cwebp -version");
    console.log("✅ cwebp 工具可用。");
  } catch (error) {
    console.error(
      "❌ 错误：cwebp 命令未找到。请确保您已安装 cwebp 并将其添加到了系统的 PATH 环境变量中。"
    );
    console.error(
      "下载地址: https://developers.google.com/speed/webp/docs/precompiled"
    );
    process.exit(1); // 退出脚本
  }
}

/**
 * 主函数
 */
async function convertImagesToWebp(
  inputDir: string,
  outputDir: string
): Promise<void> {
  console.log(`🚀 开始转换...`);
  console.log(`源目录 (A): ${inputDir}`);
  console.log(`目标目录 (B): ${outputDir}`);

  try {
    // 步骤 1: 检查 cwebp 是否可用
    await checkCwebpAvailability();

    // 步骤 2: 确保输出目录存在，如果不存在则创建
    await fs.mkdir(outputDir, { recursive: true });
    console.log(`📂 已确保目标目录存在。`);

    // 步骤 3: 读取源目录下的所有文件
    const files = await fs.readdir(inputDir);
    console.log(`🔍 在源目录中找到 ${files.length} 个文件/文件夹。`);

    // 步骤 4: 过滤出 jpg 和 png 图片
    const imageFiles = files.filter((file) => {
      const extension = path.extname(file).toLowerCase();
      return [".jpg", ".jpeg", ".png"].includes(extension);
    });

    if (imageFiles.length === 0) {
      console.log("🟡 在源目录中没有找到任何 .jpg 或 .png 图片。");
      return;
    }

    console.log(`🖼️ 找到 ${imageFiles.length} 张符合条件的图片，准备转换...`);

    // 步骤 5: 遍历并转换每一张图片
    for (const file of imageFiles) {
      const inputPath = path.join(inputDir, file);
      const outputFileName = `${path.basename(file, path.extname(file))}.webp`;
      const outputPath = path.join(outputDir, outputFileName);

      // 构建 cwebp 命令
      // 使用引号包裹路径以处理文件名中的空格
      const command = `cwebp -q ${WEBP_QUALITY} "${inputPath}" -o "${outputPath}"`;

      try {
        console.log(`⏳ 正在转换: ${file}...`);
        await execPromise(command);
        console.log(`✅ 成功转换 -> ${outputFileName}`);
      } catch (error) {
        console.error(`❌ 转换失败: ${file}`);
        console.error(error);
      }
    }

    console.log("\n🎉 所有图片转换完成！");
  } catch (error) {
    console.error("❌ 发生了一个严重错误:");
    console.error(error);
    process.exit(1);
  }
}

/**
 * 脚本入口点
 */
(async () => {
  const args = process.argv.slice(2);
  if (args.length !== 2) {
    console.log("请提供源目录 (A) 和目标目录 (B)");
    console.log("用法: yarn webp <源目录路径> <目标目录路径>");
    process.exit(1);
  }

  const [inputDir, outputDir] = args;
  await convertImagesToWebp(inputDir, outputDir);
})();
