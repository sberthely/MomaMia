//*******************************************************************
//  CREATE MATRIX AND MAP
//*******************************************************************
d3.csv('data/gurus5.csv', function (error, data) {
  var mpr = chordMpr(data);

  mpr
    .addValuesToMap('who')
    .setFilter(function (row, a, b) {
      return (row.who === a.name && row.overlap === b.name)
    })
    .setAccessor(function (recs, a, b) {
      if (!recs[0]) return 0;
      return +recs[0].years;
    });
  drawChords(mpr.getMatrix(), mpr.getMap());
});
//*******************************************************************
//  DRAW THE CHORD DIAGRAM
//*******************************************************************
function drawChords (matrix, mmap) {
  var w = 780, h = 600, r1 = h / 2.6, r0 = r1 - 30;

  var fill = d3.scale.category20b();

  var chord = d3.layout.chord()
      .padding(.02)
      .sortSubgroups(d3.descending)
      .sortChords(d3.descending);

  var arc = d3.svg.arc()
      .innerRadius(r0)
      .outerRadius(r0 + 20);

  var svg = d3.select("#diagram").append("svg")
      .attr("width", w)
      .attr("height", h)
    .append("svg:g")
      .attr("id", "circle")
      .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

      svg.append("circle")
          .attr("r", r0 + 20);

  var rdr = chordRdr(matrix, mmap);
  chord.matrix(matrix);

  var g = svg.selectAll("g.group")
      .data(chord.groups())
    .enter().append("svg:g")
      .attr("class", "group")
      .on("mouseover", mouseover)
      .on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden") });

  g.append("svg:path")
      .style("stroke", "none")
      .style("fill", function(d) { return fill(d.index); })
      .attr("d", arc);

  g.append("svg:text")
      .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
      .attr("transform", function(d) {
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
            + "translate(" + (r0 + 26) + ")"
            + (d.angle > Math.PI ? "rotate(180)" : "");
      })
      .text(function(d) { return rdr(d).gname; });

    var chordPaths = svg.selectAll("path.chord")
          .data(chord.chords())
        .enter().append("svg:path")
          .attr("class", "chord")
          .style("stroke", function(d) { return d3.rgb(fill(d.target.index)).darker(); })
          .style("fill", function(d) { return fill(d.target.index); })
          .attr("d", d3.svg.chord().radius(r0))
          .on("mouseover", function (d) {
            d3.select("#tooltip")
              .style("visibility", "visible")
              .html(chordTip(rdr(d)))
              .style("top", function () { return (d3.event.pageY - 100)+"px"})
              .style("left", function () { return (d3.event.pageX - 100)+"px";})
          })
          .on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden") });

    function chordTip (d) {
      var p = d3.format(".0%"), q = d3.format("0d")
      return "Chord info:<br/>"
        + q(d.svalue) + " collaborations between " + d.sname + " and " + d.tname
    }

    function groupTip (d) {
      var guru = d.gname, q = d3.format("0d");

      switch (guru) {
        case "g1": return "Guru Nanak"; //+ " lived for 70 years";
            break;
        case "g2": return "Guru Angad"; // + " lived for 48 years";
            break;
        case "g3": return "Guru Amar Das"; // + " lived for 95 years";
            break;
        case "g4": return "Guru Ram Das"; // + " lived for 47 years";
            break;
        case "g5": return "Guru Arjun Dev"; // + " lived for 43 years";
            break;
        case "g6": return "Guru Har Gobind"; // + " lived for 49 years";
            break;
        case "g7": return "Guru Har Rai"; // + " lived for 31 years";
            break;
        case "g8": return "Guru Har Krishan"; // + " lived for 8 years";
            break;
        case "g9": return "Guru Tegh Bahadar"; // + " lived for 54 years";
            break;
        case "g10": return "Guru Gobind Singh"; // + " lived for 42 years";
            break;
        default : return d.gname;

      }
    }

    function mouseover(d, i) {
      d3.select("#tooltip")
        .style("visibility", "visible")
        .html(groupTip(rdr(d)))
        .style("top", function () { return (d3.event.pageY - 80)+"px"})
        .style("left", function () { return (d3.event.pageX - 130)+"px";})

      chordPaths.classed("fade", function(p) {
        return p.source.index != i
            && p.target.index != i;
      });
    }
}

