(function (Fly) {
    var Game = function (id) {
        this.obj = Fly.createCV(id)
        this.cv = this.obj.cv;
        this.ctx = this.cv.getContext('2d');
        this.btn = this.obj.btn;
        this.isStart = true;

        // 存储所有的游戏对象
        this.roleList = [];
        // 存储游戏的英雄（小鸟）
        this.hero = null;
        // 游戏的资源（图片）
        this.imgSrc = ['birds', 'land', 'sky', 'pipe1', 'pipe2'];
        this.time=null;
        this.lastFrameTime = new Date();
        this.origtime= this.lastFrameTime;
        this.curFrameTime = 0;
    };

    Game.prototype = {
        constructor: Game,

        // 开始游戏
        startGame: function () {
            var that = this;

            // 调用 loadImages 等待所有的图片加载完成！
            Fly.loadImages(this.imgSrc, function (imgList) {

                // 调用初始化角色方法
                that.initRoles(imgList);

                // 调用绑定事件方法
                that.bindEvent(that.cv);

                // 调用渲染方法
                that.draw(imgList);

            });
        },

        // 结束游戏
        stopGame: function () {

            this.isStart = false;
        },

        // 初始化角色
        initRoles: function (imgList) {
            // 创建小鸟对象
            this.hero = Fly.factory('Bird', {
                ctx: this.ctx,
                img: imgList.birds
            });


            // 创建天空对象
            for (var i = 0; i < 2; i++) {
                this.roleList.push(
                    Fly.factory('Sky', {
                        ctx: this.ctx,
                        img: imgList.sky,
                        x: imgList.sky.width * i
                    })
                );
            }

            // 绘制管道
            for (var i = 0; i < 6; i++) {
                this.roleList.push(
                    Fly.factory('Pipe', {
                        ctx: this.ctx,
                        imgDown: imgList.pipe1,
                        imgUp: imgList.pipe2,
                        // 宽度 * 3 表示：管道之间的距离
                        x: i * imgList.pipe1.width * 3 + 300
                    })
                )
            }

            //绘制时间对象
            this.roleList.push(new Fly.Timer({ctx:this.ctx,origtime:this.origtime}));
            // 创建陆地对象
            for (var i = 0; i < 4; i++) {
                this.roleList.push(
                    Fly.factory('Land', {
                        ctx: this.ctx,
                        img: imgList.land,
                        x: i * imgList.land.width,
                        y: this.cv.height - imgList.land.height
                    })
                );
            }
        },

        // 渲染方法
        draw: function (imgList) {
            var that = this;

            var render = function () {
                // 当前帧时间（每次绘制都会获取当前时间）
                that.curFrameTime = new Date();
                // 得到两次绘制的时间间隔
                var delta = that.curFrameTime - that.lastFrameTime;
                // 重置上一帧时间
                that.lastFrameTime = that.curFrameTime;


                // 需要每次都开启新路径
                that.ctx.beginPath();
                // 清空画布
                that.ctx.clearRect(0, 0, cv.width, cv.height);
                // 保存默认状态（小鸟旋转改变了画布的坐标系）
                that.ctx.save();

                // 绘制所有的游戏对象
                that.roleList.forEach(function (role) {
                    role.draw(delta);
                });

                // 绘制小鸟
                that.hero.draw(delta);

                // 检测碰撞
                if (that.hero.y <= 0 || (that.hero.y >= that.cv.height - imgList.land.height) || that.ctx.isPointInPath(that.hero.x+10, that.hero.y+10)) {

                    that.isStart = false;
                }

                // 恢复到默认状态
                that.ctx.restore();

                if (that.isStart) {
                    // 动画函数处理，继续下一次渲染
                    window.requestAnimationFrame(render);
                }else{
                    that.btn.style.display='block';
                }
            };

            window.requestAnimationFrame(render);
        },

        // 绑定事件
        bindEvent: function (dv) {
            var that = this;
            that.cv.addEventListener('click', function () {
                that.hero.changeSpeed(-0.3);
            });

            that.btn.addEventListener('click', function () {
                document.querySelector("#cv").innerHTML="<button>继续游戏</button>";
                var game = new Fly.Game('cv');
                game.startGame();
            });
        }

    };

    Fly.Game = Game;

})(Fly);