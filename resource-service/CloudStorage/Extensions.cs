using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CloudStorage
{
    public static class Extensions
    {
        public static AggregatedArea EnsurePrettyRespones(this List<Area> areas)
        {
            Area root = areas.Where(d => d.parent == null).First();
            AggregatedArea aggRoot = new AggregatedArea();
            // map
            aggRoot.Name = root.name;
            aggRoot.Id = root.Id;
            aggRoot.subareas = new List<AggregatedArea>();

            AddAgg(aggRoot, areas);
            return aggRoot;
        }

        private static void AddAgg(AggregatedArea ae, List<Area> areasFromDB)
        {
            foreach (var areaDB in areasFromDB)
            {
                if (areaDB.parent == ae.Id)
                {
                    var areaAg = new AggregatedArea();
                    areaAg.Id = areaDB.Id;
                    areaAg.Name = areaDB.name;
                    areaAg.Parent = areaDB.Id;
                    areaAg.subareas = new List<AggregatedArea>();
                    AddAgg(areaAg, areasFromDB);
                    ae.subareas.Add(areaAg);
                }
            }
        }
    }
}
