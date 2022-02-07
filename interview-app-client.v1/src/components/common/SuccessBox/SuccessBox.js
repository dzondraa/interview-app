const SuccessBox = ({ messages }) => {
    return (
      <div className="alert alert-success" role="alert">
        {messages.map((message, index) => {
          return <li key={index}>{message.message}</li>;
        })}
      </div>
    );
  };
  
  export default SuccessBox;
  