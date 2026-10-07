// 入口（Work.register 容器合同）：DOM 注入 + 尺寸自适应 + 启动 + tick
Work.register({
  name: 'underrun',
  mount: function (ctx) {
    var st = ctx.stage;
    st.style.background = '#000';
    var style = document.createElement('style');
    style.textContent = "body{margin:0;background:#000}div:last-child{color:#e90;}b{animation:r 1s infinite;}@keyframes r{50%{opacity:0;}}#c{width:100%;height:100%;image-rendering:optimizeSpeed;image-rendering:pixelated;cursor:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHAQMAAAD+nMWQAAAABGdBTUEAALGPC/xhBQAAAAZQTFRFAAAA////pdmf3QAAAAF0Uk5TAEDm2GYAAAATSURBVAjXYxBgEGBgYDgGxEAWAAc4AQebSvKuAAAAAElFTkSuQmCC),auto;}#a{font-weight:bold;color:#c80;position:absolute;top:4vw;left:2vw;font-size:1.6vw;overflow:hidden;white-space:nowrap;width:94%;text-shadow: 0 0 7px #f70;transition:opacity 1s;}";
    document.head.appendChild(style);
    var c = document.createElement('canvas');
    c.id = 'c';
    c.width = (ctx.bounds && ctx.bounds.w) || 320;
    c.height = (ctx.bounds && ctx.bounds.h) || 180;
    ctx.onBounds(function (b) { c.width = b.w; c.height = b.h; });
    var a = document.createElement('code');
    a.id = 'a';
    // 左上角小字水印
    var tag = document.createElement('div');
    tag.id = 'tag';
    tag.textContent = 'UNDERRUN 汉化版';
    tag.style.position = 'absolute';
    tag.style.top = '4px';
    tag.style.left = '4px';
    tag.style.color = 'rgba(255,255,255,0.55)';
    tag.style.fontSize = '10px';
    tag.style.fontFamily = 'monospace';
    tag.style.pointerEvents = 'none';
    tag.style.userSelect = 'none';
    tag.style.zIndex = '10';
    st.appendChild(c); st.appendChild(a); st.appendChild(tag);
    this._nodes = [style, c, a, tag];
    // 触屏支持：虚拟摇杆式 pointer 控制（移动 + 射击），与键盘/鼠标并存
    var lookX = null, lookY = null, fire = false;
    this._onDown = function (e) {
      var r = c.getBoundingClientRect();
      lookX = (e.clientX - r.left) / r.width * c.width;
      lookY = (e.clientY - r.top) / r.height * c.height;
      fire = true;
      e.preventDefault();
    };
    this._onMove = function (e) {
      if (!fire) return;
      var r = c.getBoundingClientRect();
      lookX = (e.clientX - r.left) / r.width * c.width;
      lookY = (e.clientY - r.top) / r.height * c.height;
      e.preventDefault();
    };
    this._onUp = function () { fire = false; };
    c.addEventListener('pointerdown', this._onDown);
    c.addEventListener('pointermove', this._onMove);
    c.addEventListener('pointerup', this._onUp);
    c.addEventListener('pointercancel', this._onUp);
    this._pointerTimer = setInterval(function () {
      if (fire && lookX !== null) {
        // 模拟文档级 mouse 事件坐标，供游戏内瞄准使用
        var r = c.getBoundingClientRect();
        var ev = new MouseEvent('mousemove', {
          clientX: r.left + lookX / c.width * r.width,
          clientY: r.top + lookY / c.height * r.height
        });
        document.dispatchEvent(ev);
      }
    }, 33);
    underrun_boot(c, a);
  },
  tick: function () {
    // 游戏循环由内部 RAF 驱动（挂 __alive），tick 作为容器合同的安全空转
  },
  destroy: function () {
    if (window.__underrun_stop) window.__underrun_stop();
    var self = this;
    if (self._pointerTimer) { clearInterval(self._pointerTimer); self._pointerTimer = 0; }
    var c = self._nodes && self._nodes[1];
    if (c) {
      c.removeEventListener('pointerdown', self._onDown);
      c.removeEventListener('pointermove', self._onMove);
      c.removeEventListener('pointerup', self._onUp);
      c.removeEventListener('pointercancel', self._onUp);
    }
    (self._nodes || []).forEach(function (n) {
      if (n && n.parentNode) n.parentNode.removeChild(n);
    });
    self._nodes = [];
  },
});
