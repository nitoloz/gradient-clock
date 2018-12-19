function clock() {
    const START_ANGLE = 0;
    const END_ANGLE = -2 * Math.PI + 0.05;
    const ARCS_NUMBER = 360;

    const initialConfiguration = {
        width: 520,
        height: 520,
        color: d3.scaleLinear().domain([0, ARCS_NUMBER]).range(['#031c2f','#01b0de'])
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
                .startAngle(START_ANGLE)
                .endAngle(-2 * Math.PI + 0.05)
                .innerRadius(d => (d.radius - d.width) * radius)
                .outerRadius(d => (d.radius + d.width) * radius)
                .cornerRadius(lineWidth);

            const arcSection = d3.arc()
                .innerRadius(d => (d.radius - d.width) * radius)
                .outerRadius(d => (d.radius + d.width) * radius);


            const body = clockChartSvg.append("g")
                .attr("class", "bodies")
                .selectAll("g")
                .data(fields)
                .enter()
                .append("g");

            const paths = body.append("path")
                .attr("d", arcBody);

            tick();

            paths.style('fill', function (d, i) {
                return createGradient(d, i)
            });

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
                body.attr("transform", (d) => `rotate(${d.angle})`);
            }

            function createGradient(d, index) {
                let miniArcs = [];
                let miniArcAngle = 2 * Math.PI / 360;

                for (let j = 0; j < ARCS_NUMBER; j++) {
                    let miniArc = {};
                    miniArc.startAngle = START_ANGLE + (miniArcAngle * j);
                    const arcEndAngle = miniArc.startAngle + miniArcAngle + 0.01;
                    miniArc.endAngle = arcEndAngle > d.endAngle
                        ? END_ANGLE
                        : arcEndAngle;
                    miniArc.radius = d.radius;
                    miniArc.width = d.width;
                    miniArcs.push(miniArc)
                }

                d3.select(body._groups[0][index])
                    .selectAll('.mini-arc')
                    .data(miniArcs)
                    .enter()
                    .append('path')
                    .attr('class', 'arc')
                    .attr('d', arcSection)
                    .style("fill", (a, i) => color(i));

                return "none"
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


