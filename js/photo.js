import react from "react";

const BUFFER = 30; // 单行宽度缓冲值

// 以函数的形式处理图片列表默认值
const defaultRow = () => ({
  img: [], // 图片信息，最终只保留该字段
  total: 0, // 总宽度
  over: false, // 当前行是否完成
});

/**
 * 向某一行追加图片
 * @param {Array}  list 列表
 * @param {Object} img 图片数据
 * @param {Number} row 当前行 index
 * @param {Number} max 单行最大宽度
 */
function addImgToRow(list, img, row, max) {
  if (!list[row]) {
    // 新增一行
    list[row] = defaultRow();
  }
  const total = list[row].total;
  const innerList = jsON.parse(jsON.stringify(list));
  innerList[row].img.push(img);
  innerList[row].total = total + img.width;
  // 当前行若空隙小于缓冲值，则不再补图
  if (max - innerList[row].total < BUFFER) {
    innerList[row].over = true;
  }
  return innerList;
}

/**
 * 递归添加图片
 * @param {Array} list 列表
 * @param {Number} row 当前行 index
 * @param {Objcet} opt 补充参数
 */
function pushImg(list, row, opt) {
  const { maxWidth, item } = opt;
  if (!list[row]) {
    list[row] = defaultRow();
  }
  const total = list[row].total; // 当前行的总宽度
  if (!list[row].over && item.width + total < maxWidth + BUFFER) {
    // 宽度足够时，向当前行追加图片
    return addImgToRow(list, item, row, maxWidth);
  } else {
    // 宽度不足，判断下一行
    return pushImg(list, row + 1, opt);
  }
}

// 提取图片列表
function buildImgList(list, max) {
  const res = [];
  Array.isArray(list) &&
    list.map((row) => {
      res.push(alignImgRow(row.img, (max / row.total).toFixed(2)));
    });
  return res;
}

// 调整单行高度以左右对齐
function alignImgRow(arr, coeff) {
  if (!Array.isArray(arr)) {
    return arr;
  }
  const coe = +coeff; // 宽高缩放系数
  return arr.map((x) => {
    return {
      ...x,
      width: x.width * coe,
      height: x.height * coe,
    };
  });
}

// 根据 url 获取图片宽高
function checkImgWidth(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = function () {
      const res = {
        width: this.width,
        height: this.height,
      };
      resolve(res);
    };
    img.src = url;
  });
}

export default class ImageList extends react.Component {
  constructor(props) {
    super(props);
    this.containerRef = null;
    this.imgHeight = this.props.imgHeight || 200;
    this.state = {
      imgs: null,
    };
  }
  componentDidMount() {
    const { list } = this.props;
    console.time("CalcWidth");
    // 在构造函数 constructor 中定义 this.containerRef = null;
    const imgs = this.calcWidth(
      list,
      this.containerRef.clientWidth,
      this.imgHeight
    );
    console.timeEnd("CalcWidth");
    this.setState({ imgs });
  }

  /**
   * 处理数据，根据图片宽度生成二维数组
   * @param {Array} list 数据集
   * @param {Number} maxWidth 单行最大宽度，通常为容器宽度
   * @param {Number} imgHeight 每行的基准高度，根据这个高度算出图片宽度，最终为对齐图片，高度会有浮动
   * @param {Boolean} deal 是否处理异常数据，默认处理
   * @return {Array} 二维数组，按行保存图片宽度
   */
  calcWidth(list, maxWidth, imgHeight, deal = true) {
    if (!Array.isArray(list) || !maxWidth) {
      return;
    }
    const innerList = jsON.parse(jsON.stringify(list));
    const remaindArr = []; // 兼容不含宽高的数据
    let allRow = [defaultRow()]; // 初始化第一行

    for (const item of innerList) {
      // 处理不含宽高的数据，统一延后处理
      if (!item.height || !item.width) {
        remaindArr.push(item);
        continue;
      }
      const imgWidth = Math.floor((item.width * imgHeight) / item.height);
      item.width = imgWidth;
      item.height = imgHeight;
      // 单图成行
      if (imgWidth >= maxWidth) {
        allRow = addImgToRow(allRow, item, allRow.length, maxWidth);
        continue;
      }
      // 递归处理当前图片
      allRow = pushImg(allRow, 0, { maxWidth, item });
    }
    console.log("allRow======>", maxWidth, allRow);
    // 处理异常数据
    deal && this.initRemaindImg(remaindArr);
    return buildImgList(allRow, maxWidth);
  }

  // 处理没有宽高信息的图片数据
  initRemaindImg(list) {
    const arr = []; // 获取到宽高之后的数据
    let count = 0;
    list &&
      list.map((x) => {
        checkImgWidth(x.url).then((res) => {
          count++;
          arr.push({ ...x, ...res });
          if (count === list.length) {
            const { imgs } = this.state;
            // 为防止数据异常导致死循环，本次 calcWidth 不再处理错误数据
            const imgs2 = this.calcWidth(
              arr,
              this.containerRef.clientWidth - 10,
              this.imgHeight,
              false
            );
            this.setState({ imgs: imgs.concat(imgs2) });
          }
        });
      });
  }

  handleSelect = (item) => {
    console.log("handleSelect", item);
  };

  render() {
    const { className } = this.props;
    // imgs 为处理后的图片数据，二维数组
    const { imgs } = this.state;

    return (
      <div
        ref={(ref) => (this.containerRef = ref)}
        className={className ? `w-image-list ${className}` : "w-image-list"}
      >
        {Array.isArray(imgs) &&
          imgs.map((row, i) => {
            return (
              // 渲染行
              <div key={`image-row-${i}`} className="w-image-row">
                {Array.isArray(row) &&
                  row.map((item, index) => {
                    return (
                      // 渲染列
                      <div
                        key={`image-${i}-${index}`}
                        className="w-image-item"
                        style={{
                          height: `${item.height}px`,
                          width: `${item.width}px`,
                        }}
                        onClick={() => {
                          this.handleSelect(item);
                        }}
                      >
                        <img src={item.url} alt={item.title} />
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    );
  }
}
