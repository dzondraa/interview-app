using CloudStorage.Dto.Requests;
using CloudStorage.RepositoryImplementation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CloudStorage.Helpers
{
    public static class DataAggregation
    {
        public static IEnumerable<InterviewCandidateResponse> FilterByAreasAndStatus(
            this IEnumerable<InterviewCandidateResponse> records, 
            InterviewFilter filter)
        {
            if (filter.Areas == null && filter.Status == null && filter.Candidate == null) return records;

            var response = new List<InterviewCandidateResponse>();
            foreach (InterviewCandidateResponse record in records)
            {
                var valid = true;
                if(filter.Areas != null)
                {
                    foreach (string areaFromReq in filter.Areas)
                    {
                        if (!record.Skills.Contains(areaFromReq))
                        {
                            valid = false;
                            break;
                        }

                    }
                }
                
                if (filter.Status != null && record.Status != filter.Status)
                {
                    valid = false;
                }

                if (filter.Candidate != null && record.Email != filter.Candidate)
                {
                    valid = false;
                }
                if (valid) response.Add(record);
            }
            return response;
            
        }
    }
}
