import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { getProducts } from "../../redux/actions/productAction";
import Products from "../../components/market/Products";
import category from "../../data/category.json";

const Market = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const [search, setSearch] = useState("");

  const handleGetCategory = (category) => {
    dispatch(getProducts({ auth, category }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search) return;
    dispatch(getProducts({ auth, search }));
  };

  useEffect(() => {
    dispatch(getProducts({ auth }));
  }, [dispatch, auth]);

  return (
    <div className="card_detail">
      <div className="search_product">
        <form onSubmit={handleSearch} className="form_search">
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              value={search}
              placeholder="Tìm kiếm ..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </form>
        <button
          className="btn_post_product"
          onClick={() =>
            dispatch({ type: GLOBALTYPES.STATUS, payload: { onMarket: true } })
          }
        >
          Đăng bài
        </button>
      </div>
      <div className="row categories_container">
        <h5 className="py-2">Khám phá danh mục</h5>
        {category.category.map((link, index) => (
          <div
            className="col text-center"
            key={index}
            onClick={() => handleGetCategory(link.label)}
          >
            <span
              className="material-icons"
              style={{ fontSize: "3rem", color: "#88c431" }}
            >
              {link.icon}
            </span>
            <p className="fw-bold m-0">{link.label}</p>
          </div>
        ))}
      </div>
      <h5 className="py-2 mt-2">Tin đăng mới </h5>
      <Products />
    </div>
  );
};

export default Market;
