function clock() {
    const initialConfiguration = {
        width: 520,
        height: 520,
        color: d3.scaleSequential(d3.interpolateRainbow).domain([0, 360])
    };

    let width = initialConfiguration.width,
        height = initialConfiguration.height,
        fields = [
            {radius: 0.3, width: 0.149, interval: d3.timeDay},//0.34-0.45
            {radius: 0.55, width: 0.099, interval: d3.timeHour},//0.5-0.6
            {radius: 0.7, width: 0.05, interval: d3.timeMinute}//0.65-0.75
        ],
        color = initialConfiguration.color;

    function chart(selection) {
        selection.each(function () {
            const radius = Math.min(width, height) / 2;
            const lineWidth = radius * 0.05;

            const svg = selection
                .append('svg')
                .attr('height', height)
                .attr('width', width)
                .attr('transform', 'translate(41,31)');

            const clockChartSvg = svg
                .append("g")
                .attr("transform", `translate(${width / 2}, ${height / 2})`);

            const arcBody = d3.arc()
                .startAngle(0)
                .endAngle(-2 * Math.PI + 0.05)
                .innerRadius(d => (d.radius - d.width) * radius)
                .outerRadius(d => (d.radius + d.width) * radius)
                .cornerRadius(lineWidth);


            const body = clockChartSvg.append("g")
                .attr("class", "bodies")
                .selectAll("g")
                .data(fields)
                .enter()
                .append("g");

            const paths = body.append("path")
                .attr("d", arcBody);

            tick();
            d3.timer(tick);

            function tick() {
                const now = Date.now();

                fields.forEach((d) => {
                    const start = d.interval(now),
                        end = d.interval.offset(start, 1);
                    d.angle = d.interval === d3.timeDay
                        ? Math.round((now - start) / (end - start) * 360 * 100) / 50
                        : Math.round((now - start) / (end - start) * 360 * 100) / 100;
                });

                body.style("fill", (d) => color(d.angle))
                    .attr("transform", (d) => `rotate(${d.angle})`);
            }
        })
    }

    chart.width = function (value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.height = function (value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    return chart;
}

const myClock = clock();
d3.select("#clock-div").call(myClock);


