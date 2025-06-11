# Tinypng 图片压缩&转换
[tinypng](https://tinypng.com/)提供了官方接口调用的方式，免费的key一个月有500次额度，自行[申请一下key](https://tinify.com/developers)

然后再项目根目录下创建`.env`文件，输入以下内容
```
API_KEY=""
IMG_SRC=""
IMG_TINY="tiny"
TEST=1
```

API_KEY="你刚刚申请的key"  
IMG_SRC="图片所在文件夹的目录的绝对路径"  
IMG_TINY="处理后图片的文件夹名字（在上面这个路径里面）"  
TEST=1开启测试0关闭测试  
  
或者你直接改一下代码也行...

安装依赖
```
yarn
```

运行（注意，设置了TEST=1会吧图片目录下的第一层级的第一张图片进行压缩，TEST=0就是第一层级下的所有图片）
```
yarn start
```

开发状态使用（除了会实时监听文件变更以外行为无区别）
```
yarn dev
```