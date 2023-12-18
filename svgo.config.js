module.exports = {
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          cleanupAttrs: true,
          removeDoctype: true,
          removeXMLProcInst: true,
          removeComments: true,
          removeMetadata: true,
          removeTitle: true,
          removeDesc: true,
          removeUselessDefs: true,
          removeEditorsNSData: true,
          removeEmptyAttrs: true,
          removeHiddenElems: true,
          removeEmptyText: true,
          removeEmptyContainers: true,
          removeViewBox: true,
          cleanupEnableBackground: true,
          convertColors: true,
          convertPathData: true,
          convertTransform: true,
          removeUnknownsAndDefaults: true,
          removeNonInheritableGroupAttrs: true,
          removeUselessStrokeAndFill: true,
          removeUnusedNS: true,
          cleanupNumericValues: {
            floatPrecision: 1,
          },
          moveElemsAttrsToGroup: true,
          moveGroupAttrsToElems: true,
          collapseGroups: true,
          mergePaths: true,
          convertShapeToPath: {
            convertArcs: true,
          },
          sortAttrs: true,
        },
      },
    },
    {
      name: "removeAttrs",
      params: {
        attrs: "(width|height|style|color|fill)",
      },
    },
    {
      name: "addAttributesToSVGElement",
      params: {
        attributes: [{ fill: "currentColor" }],
      },
    },
  ],
};
