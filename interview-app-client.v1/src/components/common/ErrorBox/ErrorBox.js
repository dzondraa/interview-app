const ErrorBox = ({ errors }) => {
  return (
    <div class="alert alert-danger" role="alert">
      {errors.map((error, index) => {
        return <li key={index}>{error.message}</li>;
      })}
    </div>
  );
};

export default ErrorBox;
