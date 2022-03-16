import * as d3 from "d3";
import Experience from '../Experience/Experience';

export default class CSVData {
    constructor() {
        this.experience = new Experience();
        this.exportDataFromCSV();
        this.scaleFactor = 1000;
    }

    exportDataFromCSV() {
        Promise.all([
            d3.dsv(";", "./data/VHC_VLANDS_IDandCoordinates.csv"),
            d3.dsv(";", "./data/VHC_MAPandGreens.csv"),
            d3.dsv(";", "./data/VHC_MAPandstreets.csv"),
            d3.dsv(";", "./data/VHC_MAPandHills.csv"),
            d3.dsv(";", "./data/VHC_MAPandCommonSpaces.csv"),
            d3.csv("./data/VHC_MAPandDiagonalsParallels.csv"),
            d3.dsv(";", "./data/VHC_MAPandLakes.csv"),
        ]).then(([all_lands, greens, streets, hills, commonSpaces, bridges, lakes]) => {
            const data = all_lands.map(d => {
                const [xy1_x, xy1_y] = d._1_XY.split(", ").map(d => +d);
                const [xy2_x, xy2_y] = d._2_XY.split(", ").map(d => +d);
                const [xy3_x, xy3_y] = d._3_XY.split(", ").map(d => +d);
                const [xy4_x, xy4_y] = d._4_XY.split(", ").map(d => +d);

                const x1 = Math.min(xy1_x, xy2_x, xy3_x, xy4_x);
                const y1 = Math.min(xy1_y, xy2_y, xy3_y, xy4_y);

                // columns that you want to keep
                const keys = [
                    'DISTRICT',
                    'VLAND ID',
                    'COORDINATES',
                    'Cluster',
                    'HUMAN INSTINCT',
                ];

                const obj = {
                    x1,
                    y1,
                    Type: d['TYPE OF LAND'],
                };

                keys.forEach(k => obj[k] = d[k]);

                return obj;
            });

            // const greenData = this.processCoords(greens);
            // const streetsData = this.processCoords(streets);
            // const lakesData = this.processCoords(lakes);

            // const hillsData = hills.map((d) => {
            //     return {
            //         Name: d.Name,
            //         coords: [
            //             d.HILLS_1_XY.split(",").map((d) => +d / scaleFactor),
            //             d.HILLS_2_XY.split(",").map((d) => +d / scaleFactor),
            //             d.HILLS_3_XY.split(",").map((d) => +d / scaleFactor),
            //         ],
            //     };
            // });

            // const common = commonSpaces.map((d) => {
            //     return {
            //         Name: d.Name,
            //         coords: [
            //             d.COMMONSPACE_1_XY.split(",").map((d) => +d / scaleFactor),
            //             d.COMMONSPACE_2_XY.split(",").map((d) => +d / scaleFactor),
            //             d.COMMONSPACE_3_XY.split(",").map((d) => +d / scaleFactor),
            //             d.COMMONSPACE_4_XY.split(",").map((d) => +d / scaleFactor),
            //             // d.COMMONSPACE_5_XY.split(",").map(d => +d),
            //             d.COMMONSPACE_6_XY.split(",").map((d) => +d / scaleFactor),
            //             d.COMMONSPACE_7_XY.split(",").map((d) => +d / scaleFactor),
            //         ],
            //     };
            // });

            // const bridgesData = this.processCoords(bridges);

            this.experience.lands = data.map(d => {
                return {
                    ...d,
                    x1: d.x1 / this.scaleFactor,
                    y1: d.y1 / this.scaleFactor,
                }
            });
        });
    }

    // processCoords(greens, index = 2) {
    //     const columns = greens.columns.slice(index);

    //     return greens.map((d) => {
    //       const coords = columns
    //         .filter((x) => d[x])
    //         .map((x) => {
    //           return d[x].split(",").map((x) => +x / scaleFactor);
    //         });

    //       return {
    //         Name: d.Name,
    //         coords,
    //       };
    //     });
    //   }
}



//     vaultHill = VaultHill({
//         data: {
//             lands: data.map(d => {
//                 return {
//                     ...d,
//                     x1: d.x1 / scaleFactor,
//                     y1: d.y1 / scaleFactor,
//                 }
//             }),
//             greenAreas: [...greenData, ...hillsData],
//             commonSpaces: common,
//             streets: streetsData,
//             bridges: bridgesData,
//             lakes: lakesData,
//         },
//         container: "#scene",
//         material: 'ocean',
//         onLandClick: (land) => {
//             console.log("land was clicked", land);
//         },
//         landTooltipHTML: (land) => {
//             const fieldsNotShown = [];
//             let html = '';

//             Object.keys(land).filter(k => {
//                 return fieldsNotShown.indexOf(k) === -1;
//             }).forEach(k => {
//                 html += `
//   <div class="tooltip-row">
//     <label>${k}:</label> 
//     <div>${land[k]}</div>
//   </div>
// `
//             });

//             return html;
//         }
//     });
// });