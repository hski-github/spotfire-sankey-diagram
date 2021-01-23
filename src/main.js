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
         * Create required data structure
         */
		rows.forEach(function(row){
			var barvalue = Number(row.continuous("Y").value());
			var path = row.categorical("X").value();
			var barcolor = row.color().hexCode;
			
			var path1;
			var path2;
			if ( path.length == 2 ){
				path1 = path[0].formattedValue() + " (From)";
				path2 = path[1].formattedValue() + " (To)";
			}
			
			//TODO
		});
		
		
		/**
		 * Render data structure
		 */
		//TODO
		
		
        /**
         * Signal that the mod is ready for export.
         */
        context.signalRenderComplete();
    }
});
