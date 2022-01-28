import Api from "../../services/Service";
import config from "../../config/config";
import { useState } from "react";
import validator from "validator";
import ErrorBox from "../common/ErrorBox/ErrorBox";
const SearchDocForm = ({
  parentServices: { setIsSearching, setDocuments },
}) => {
  const api = Api.getResourceApiInstance();
  const [keyword, setKeyword] = useState("");
  const [wordCount, setWordCount] = useState("");
  const [errors, setErrors] = useState([]);

  const submitButton = () => {
    const errorList = validate();
    setErrors((e) => (e = errorList));
    if (errorList.length) return;
    api
      .get(
        `documents?path=${config.FILE_REPOSITORY}&targetMatch=${wordCount}&keyword=${keyword}`
      )
      .then((res) => {
        setDocuments(res);
        setIsSearching((value) => (value = !value));
      });

    setIsSearching((value) => (value = !value));
  };

  const validate = () => {
    var errors = [];
    if (validator.isEmpty(keyword))
      errors.push({
        property: "keyword",
        message: "Keyword limiter is required",
      });
    if (validator.isEmpty(wordCount))
      errors.push({
        property: "wordcount",
        message: "Word count limiter is required",
      });
    return errors;
  };

  return (
    <>
      <form className="form-inline">
        <div className="form-group mb-2">
          <label htmlFor="staticEmail2" className="sr-only">
            Email
          </label>
          <input
            type="text"
            className="form-control"
            id="staticEmail2"
            placeholder="Keyword"
            onChange={(e) => {
              setKeyword((kw) => (kw = e.target.value));
            }}
          />
        </div>
        <div className="form-group mx-sm-3 mb-2">
          <label htmlFor="inputPassword2" className="sr-only">
            Password
          </label>
          <input
            type="number"
            className="form-control"
            id="inputPassword2"
            placeholder="Word count"
            onChange={(e) => {
              setWordCount((wc) => (wc = e.target.value));
            }}
          />
        </div>
        <button
          onClick={submitButton}
          type="button"
          className="btn btn-primary mb-2"
        >
          Scrape!
        </button>
      </form>
      {errors.length ? <ErrorBox errors={errors} /> : null}
    </>
  );
};

export default SearchDocForm;
