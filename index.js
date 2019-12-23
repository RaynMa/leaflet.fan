(function(){
    L.Canvas.include({
        _updateFanPath: function(layer) {
            if(!this._drawing || layer._empty()) { return; }
            const { startAngle ,endAngle, radius, appearLevel } = layer.options;
            if (this._map._zoom - appearLevel <= 0) { return; }
            const startRadian = startAngle*Math.PI/180,
                endRadian = endAngle*Math.PI/180,
                showRadius = radius*(this._map._zoom - appearLevel);
            var p = layer._point,
                ctx = this._ctx,
                r = Math.max(Math.round(layer._radius), 1),
                s = (Math.max(Math.round(layer._radiusY), 1) || r) / r;

            if (s !== 1) {
                ctx.save();
                ctx.scale(1, s);
            }

            var startPoint = [p.x + Math.cos(startRadian)*showRadius, p.y + Math.sin(startRadian)*showRadius];

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(...startPoint);
            ctx.arc(p.x, p.y, showRadius, startRadian, endRadian, false);
            ctx.lineTo(p.x, p.y);

            if (s !== 1) {
                ctx.restore();
            }

            this._fillStroke(ctx, layer);
        }
    })
    L.SVG.include({
        _updateFanPath: function(layer) {
            var t = layer._point;
            const { startAngle ,endAngle, radius, appearLevel } = layer.options;
            if(this._map._zoom - appearLevel > 0) {
                const showRadius = radius*(this._map._zoom - appearLevel);
                const startRadian = startAngle*Math.PI/180;
                const endRadian = endAngle*Math.PI/180;
                var startPoint = [t.x + Math.cos(startRadian)*showRadius, t.y + Math.sin(startRadian)*showRadius];
                var endPoint = [t.x + Math.cos(endRadian)*showRadius, t.y + Math.sin(endRadian)*showRadius];
                var path_svg = "M" + t.x + "," + t.y;
                path_svg += "L" + startPoint[0] + "," + startPoint[1];

                path_svg += "A" + showRadius + "," + showRadius + ",0,0,1," + endPoint[0] + "," + endPoint[1]+'Z';
                this._setPath(layer,path_svg);
            } else {
                this._setPath(layer,'');
            }

        }
    })
    L.Fan = L.CircleMarker.extend({
        options: {
            appearLevel: 2,
            radius: 10
        },

        _updatePath: function () {
            if(this._map && this._renderer) {
                this._renderer._updateFanPath(this);
            }
        },
    })
    L.fan = function(latlngs, options) {
        //@ts-ignore
        return new L.Fan(latlngs,options)
    }
})()