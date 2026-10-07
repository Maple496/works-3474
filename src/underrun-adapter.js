// 入口（Work.register 容器合同）：DOM 注入 + 尺寸自适应 + 启动
Work.register({
  name: 'underrun',
  mount: function (ctx) {
    ctx = ctx || {};
    var st = ctx.stage;
    if (!st || typeof st.appendChild !== 'function') {
      // 容器缺失时自建并挂到 body，保证 mount 不因 harness 环境差异崩溃
      st = document.createElement('div');
      st.style.position = 'absolute';
      st.style.left = '0';
      st.style.top = '0';
      st.style.width = '100%';
      st.style.height = '100%';
      st.style.overflow = 'hidden';
      (document.body || document.documentElement).appendChild(st);
      this._ownStage = st;
    }
    this._stage = st;
    st.style.background = '#000';
    st.style.position = 'relative';

    var style = document.createElement('style');
    style.textContent = "body{margin:0;background:#000}div:last-child{color:#e90;}b{animation:r 1s infinite;}@keyframes r{50%{opacity:0;}}#c{width:100%;height:100%;image-rendering:optimizeSpeed;image-rendering:pixelated;cursor:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHAQMAAAD+nMWQAAAABGdBTUEAALGPC/xhBQAAAAZQTFRFAAAA////pdmf3QAAAAF0Uk5TAEDm2GYAAAATSURBVAjXYxBgEGBgYDgGxEAWAAc4AQebSvKuAAAAAElFTkSuQmCC),auto;}#a{font-weight:bold;color:#c80;position:absolute;top:4vw;left:2vw;font-size:1.6vw;overflow:hidden;white-space:nowrap;width:94%;text-shadow: 0 0 7px #f70;transition:opacity 1s;}";
    document.head.appendChild(style);

    var b = ctx.bounds || {};
    var c = document.createElement('canvas');
    c.id = 'c';
    c.width = b.w || 320;
    c.height = b.h || 180;
    if (typeof ctx.onBounds === 'function') {
      ctx.onBounds(function (nb) {
        if (nb && nb.w && nb.h) { c.width = nb.w; c.height = nb.h; }
      });
    }

    var a = document.createElement('code');
    a.id = 'a';

    var tag = document.createElement('div');
    tag.textContent = 'UNDERRUN 汉化版';
    tag.style.position = 'absolute';
    tag.style.top = '2px';
    tag.style.left = '2px';
    tag.style.color = '#e90';
    tag.style.fontSize = '10px';
    tag.style.lineHeight = '12px';
    tag.style.fontFamily = 'monospace';
    tag.style.pointerEvents = 'none';
    tag.style.zIndex = '10';

    st.appendChild(c); st.appendChild(a); st.appendChild(tag);
    this._nodes = [style, c, a, tag];
    underrun_boot(c, a);
  },
  destroy: function () {
    if (window.__underrun_stop) window.__underrun_stop();
    var self = this;
    (self._nodes || []).forEach(function (n) {
      if (n && n.parentNode) n.parentNode.removeChild(n);
    });
    self._nodes = [];
    if (self._ownStage && self._ownStage.parentNode) {
      self._ownStage.parentNode.removeChild(self._ownStage);
    }
    self._ownStage = null;
    self._stage = null;
  },
});
