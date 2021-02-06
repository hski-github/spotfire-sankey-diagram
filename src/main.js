/**
 * Get access to the Spotfire Mod API by providing a callback to the initialize method.
 * @param {Spotfire.Mod} mod - mod api
 */
Spotfire.initialize(async (mod) => {
    /**
     * Create the read function.
     */
    const reader = mod.createReader(mod.visualization.data(), mod.windowSize(), mod.property("myProperty"));

    /**
     * Store the context.
     */
    const context = mod.getRenderContext();

    /**
     * Initiate the read loop
     */
    reader.subscribe(render);

    /**
     * @param {Spotfire.DataView} dataView
     * @param {Spotfire.Size} windowSize
     * @param {Spotfire.ModProperty<string>} prop
     */
    async function render(dataView, windowSize, prop) {
        /**
         * Check the data view for errors
         */
        let errors = await dataView.getErrors();
        if (errors.length > 0) {
            // Showing an error overlay will hide the mod iframe.
            // Clear the mod content here to avoid flickering effect of
            // an old configuration when next valid data view is received.
            mod.controls.errorOverlay.show(errors);
            return;
        }
        mod.controls.errorOverlay.hide();


        /**
         * Get rows from dataView
         */
        const rows = await dataView.allRows();
        if (rows == null) {
            // User interaction caused the data view to expire.
            // Don't clear the mod content here to avoid flickering.
            return;
        }


		var cataxis = await dataView.categoricalAxis("X");
		var cataxislevels = cataxis.hierarchy.levels;
		
		
		/**
		 * Create data structure for bars
		 */
		var bars = new Array();
		for(var i in cataxislevels){
			var bar = new Map();
			bar.height = 0;
			rows.forEach(function(row){
				var rowvalue = Number(row.continuous("Y").value());
				var rowlabel = row.categorical("X").value();
				
				var rowlabelpart = rowlabel[i].formattedValue();
				if ( !bar.has(rowlabelpart) ){ bar.set( rowlabelpart, { height: 0 } ); }
				
				bar.get(rowlabelpart).height += rowvalue;
				bar.height += rowvalue;
	
				//TODO Check for negative bar values and show error
				//TODO Check if sum of all barvalues is the same for all paths
			});			
			bars.push(bar);			
		}

			
		/**
		 * Clear SVG and set constants
		 */	
		var svgmod = document.querySelector("#mod-svg");
		svgmod.setAttribute("width", windowSize.width);
		svgmod.setAttribute("height", windowSize.height);
		svgmod.innerHTML = "";
		
		var gbars = document.createElementNS("http://www.w3.org/2000/svg","g");
		var glabels = document.createElementNS("http://www.w3.org/2000/svg","g");
		svgmod.appendChild(gbars);
		svgmod.appendChild(glabels);

		//TODO barsegmentgap should be look at max number of size to ensure certain minimum space between segments 
		//TODO bargap should be dynamic based on number of bars
		const barsegmentgap = 20;
		const barwidth = 10;
		const barsegmentlabelgap = 3;
		const bargap = (windowSize.width - barwidth * (bars.length) ) / (bars.length - 1);
		const heightscale = windowSize.height / (bars[0].height + barsegmentgap );
		
		
		/**
		 * Render bars
		 */
		for(var i in bars){
			var bar = bars[i];
			var barheightcursor = 0;
			
			bar.forEach(function(barsegment, barsegmentlabel){
				var x = bargap * i;
				var y = barheightcursor;
				barsegment.x = x;
				barsegment.y = y;
				barsegment.heightcursor = y;

				var rect = document.createElementNS("http://www.w3.org/2000/svg","rect");
				rect.setAttribute("x", x);
				rect.setAttribute("y", y);
				rect.setAttribute("width", barwidth);
				rect.setAttribute("height", barsegment.height * heightscale);
				rect.setAttribute("style", "fill:grey;");
				gbars.appendChild(rect);
				
				var text = document.createElementNS("http://www.w3.org/2000/svg","text");
				if ( i == bars.length - 1 ) {
					text.setAttribute("x", x - barsegmentlabelgap);
					text.setAttribute("text-anchor", "end");
				}				
				else {
					text.setAttribute("x", x + barwidth + barsegmentlabelgap);
					text.setAttribute("text-anchor", "start");
				}
				if ( y < windowSize.height - barsegmentgap ){
					text.setAttribute("baseline-shift", "-1em");
					text.setAttribute("y", y);
				}
				else {
					text.setAttribute("y", windowSize.height);					
				}
				text.innerHTML = barsegmentlabel;
				glabels.appendChild(text);

				barheightcursor += (barsegment.height + barsegmentgap / (bar.size - 1) ) * heightscale ;
			});
		}
				
		/**
		 * Render rows
		 */	
		rows.forEach(function(row, j){
			var rowvalue = Number(row.continuous("Y").value());
			var rowlabel = row.categorical("X").value();
			var rowcolor = row.color().hexCode;
			
			for(var i = 0; i < rowlabel.length; i++){
				
				var bar1 = bars[i];
				var barsegment1 = bar1.get(rowlabel[i].formattedValue());

				if ( i + 1 < rowlabel.length ){

					var bar2 = bars[i + 1];
					var barsegment2 = bar2.get(rowlabel[i + 1].formattedValue());

					var path = document.createElementNS("http://www.w3.org/2000/svg","path");
					var d = "";
					d += "M "+ (barsegment1.x + barwidth) + "," + barsegment1.heightcursor + " ";
					d += "C " + (barsegment1.x + barwidth + bargap / 4) + "," + barsegment1.heightcursor + " ";
					d += (barsegment2.x - bargap / 4) + "," + barsegment2.heightcursor + " ";
					d += barsegment2.x + "," + barsegment2.heightcursor + " ";
					d += "L " + barsegment2.x + "," + (barsegment2.heightcursor + rowvalue * heightscale) + " "; 
					d += "C " + (barsegment2.x - bargap / 4) + "," + (barsegment2.heightcursor + rowvalue * heightscale) + " "; 
					d += (barsegment1.x + barwidth + bargap / 4) + "," + (barsegment1.heightcursor + rowvalue * heightscale) + " ";
					d += (barsegment1.x + barwidth) + "," + (barsegment1.heightcursor + rowvalue * heightscale) + " ";
					d += "Z";
					path.setAttribute("d", d);
					path.setAttribute("style", "fill:" + rowcolor + ";opacity:0.6;");
					path.setAttribute("row", j)
					gbars.append(path);
					
				}
				barsegment1.heightcursor += rowvalue * heightscale;
			}

		});
			
        /**
         * Signal that the mod is ready for export.
         */
        context.signalRenderComplete();
    }
});
