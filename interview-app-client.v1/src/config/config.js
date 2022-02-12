const config = {
  AUTH_SERVICE: "https://reqres.in/api",
  LIVE_INTERVIEW_SERVICE: "http://localhost:5000",
  RESOURCES:
    process.env.REACT_APP_ENV == "development"
      ? "https://localhost:2222/api"
      : "https://localhost:5001/api",
  FILE_REPOSITORY: "C:\\Users\\v-dnikolic\\Desktop\\Private\\ReviewedCVs",
  INTERVIEWER: "djole.nic@gmail.com",
  routerProtection: {
    interviewer: ["live", "interviews", "reviewed", "areas", "candidates"],
    candidate: ["live", "interviews"],
  },
  navigation: [
    {
      name: "Reviewed CVs",
      href: "reviewed",
    },
    {
      name: "Technical areas",
      href: "areas",
    },
    {
      name: "Candidates",
      href: "candidates",
    },
    {
      name: "Interviews",
      href: "interviews",
    },
  ],
};

export default config;
