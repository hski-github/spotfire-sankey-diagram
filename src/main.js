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

		
        /**
         * Create required data structure to render nodes
         */
		var totalcount = 0;
		var path1bars = new Map();
		var path2bars = new Map();

		rows.forEach(function(row){
			var barvalue = Number(row.continuous("Y").value());
			var path = row.categorical("X").value();
			//var barcolor = row.color().hexCode;
			
			var path1;
			var path2;
			
			if ( path.length == 2 ){
				path1 = path[0].formattedValue();
				path2 = path[1].formattedValue();
			
				if ( !path1bars.has(path1) ){
					path1bars.set( path1, 0 );
				}
				if ( !path2bars.has(path2) ){
					path2bars.set( path2, 0 );
				}

				path1bars.set(path1, path1bars.get(path1) + barvalue);
				path2bars.set(path2, path2bars.get(path2) + barvalue);

			}
			//TODO Check for negative bar values and show error
			//TODO Check if sum of all barvalues is the same for all paths
			totalcount += barvalue;
		});
		
		
		/**
		 * Render nodes
		 */
		//TODO
		var svgmod = document.querySelector("#mod-svg");
		svgmod.innerHTML = "";

		//TODO bargap should be look at max number of size to ensure certain minimum space between segments 
		var bargap = 20;
		
		var barsegmentposition = 0;
		path1bars.forEach(function(pathbarvalue, path){
			var barsegmentrect = document.createElementNS("http://www.w3.org/2000/svg","rect");
			barsegmentrect.setAttribute("x", 0);
			barsegmentrect.setAttribute("y", barsegmentposition);
			barsegmentrect.setAttribute("width", 10);
			barsegmentrect.setAttribute("height", pathbarvalue);
			barsegmentposition += pathbarvalue + bargap / path1bars.size;
			svgmod.appendChild(barsegmentrect);
		});
		
		barsegmentposition = 0;
		path2bars.forEach(function(pathbarvalue, path){
			var barsegmentrect = document.createElementNS("http://www.w3.org/2000/svg","rect");
			barsegmentrect.setAttribute("x", 100);
			barsegmentrect.setAttribute("y", barsegmentposition);
			barsegmentrect.setAttribute("width", 10);
			barsegmentrect.setAttribute("height", pathbarvalue);
			barsegmentposition += pathbarvalue + bargap / path2bars.size;
			svgmod.appendChild(barsegmentrect);
		});
		
		
        /**
         * Signal that the mod is ready for export.
         */
        context.signalRenderComplete();
    }
});
