import * as fs from "fs/promises";
import * as path from "path";

/**
 * 删除当前目录下有同名 .webp 文件的图片 (.jpg, .png)
 */
async function deleteDuplicateImages(directory?: string): Promise<void> {
  const directoryPath: string = directory || process.cwd();
  console.log(`正在扫描目录: ${directoryPath}`);

  try {
    const files: string[] = await fs.readdir(directoryPath);
    const fileSet: Set<string> = new Set(files);
    let deletedCount: number = 0;

    // 使用 for...of 循环以便在循环内部使用 await
    for (const file of files) {
      const extension: string = path.extname(file).toLowerCase();

      // 检查文件是否是需要处理的图片类型
      if (extension === ".jpg" || extension === ".png") {
        const baseName: string = path.basename(file, extension);
        const webpFileName: string = `${baseName}.webp`;

        // 检查是否存在对应的 .webp 文件
        if (fileSet.has(webpFileName)) {
          try {
            await fs.unlink(path.join(directoryPath, file));
            console.log(`已删除: ${file} (因为存在 ${webpFileName})`);
            deletedCount++;
          } catch (unlinkError) {
            console.error(`删除文件时出错 ${file}:`, unlinkError);
          }
        }
      }
    }

    // 总结信息
    if (deletedCount > 0) {
      console.log(`\n操作完成。总共删除了 ${deletedCount} 个图片文件。`);
    } else {
      console.log("\n操作完成。没有找到可删除的重复图片文件。");
    }
  } catch (readDirError) {
    console.error(`无法扫描目录 ${directoryPath}:`, readDirError);
  }
}

// 执行主函数
deleteDuplicateImages("");
