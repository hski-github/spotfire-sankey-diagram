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
		
		var nodelevels = new Array();
		
		for(var i in cataxislevels){
			var nodelevel = new Map();
			rows.forEach(function(row){
				var barvalue = Number(row.continuous("Y").value());
				var path = row.categorical("X").value();
				//var barcolor = row.color().hexCode;
				
				var path1 = path[i].formattedValue();
				if ( !nodelevel.has(path1) ){ nodelevel.set( path1, { height: 0} ); }
				
				nodelevel.get(path1).height += barvalue;
	
				//TODO Check for negative bar values and show error
				//TODO Check if sum of all barvalues is the same for all paths
			});			
			
			nodelevels.push(nodelevel);			
		}

				
		/**
		 * Render nodes
		 */
		var svgmod = document.querySelector("#mod-svg");
		svgmod.innerHTML = "";

		//TODO bargap should be look at max number of size to ensure certain minimum space between segments 
		var bargap = 20;
		
		for(var i in nodelevels){
			var nodelevel = nodelevels[i];
			var barsegmentposition = 0;
			nodelevel.forEach(function(pathbarvalue, path){
				var height = pathbarvalue.height;
				var barsegmentrect = document.createElementNS("http://www.w3.org/2000/svg","rect");
				barsegmentrect.setAttribute("x", 100 * i);
				barsegmentrect.setAttribute("y", barsegmentposition);
				barsegmentrect.setAttribute("width", 10);
				barsegmentrect.setAttribute("height", height);
				barsegmentposition += height + bargap / nodelevel.size;
				svgmod.appendChild(barsegmentrect);
			});
		}
				
		
        /**
         * Signal that the mod is ready for export.
         */
        context.signalRenderComplete();
    }
});
