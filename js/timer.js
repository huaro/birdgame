(function (Fly) {
    var Timer= function (config) {
        this.ctx=config.ctx;
        this.origtime=config.origtime-0;
        this.begintime=config.origtime-0;
    }
    Timer.prototype={
        constructor:Timer,
        draw:function(delta){
            this.origtime+=delta;
            var time=(this.origtime-this.begintime)/1000;
            var hours = Math.floor(time/ (60 * 60));
            var minutes = Math.floor(time % (60 * 60) / 60);
            var seconds = Math.floor(time % 60);
            var milliseconds = (time - seconds).toFixed(3) * 1000;
            var txt='坚持了' + hours + '小时' + minutes + '分钟' + seconds + '秒' + milliseconds + "毫秒！";;

            this.ctx.save();
            this.ctx.font="30px 微软雅黑";
            this.ctx.fillStyle="deeppink";
            this.ctx.fillText(txt,360,80);
        }
    }

    Fly.Timer=Timer;
})(Fly)
