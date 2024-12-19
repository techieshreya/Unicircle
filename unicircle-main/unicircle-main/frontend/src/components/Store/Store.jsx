import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  Button,
  Card,
  Checkbox,
  FileInput,
  Label,
  Radio,
  Select,
  TextInput,
  Textarea,
} from "flowbite-react";

const Store = () => {
  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      window.location.href = "/login";
    }
  });
  return (
    <div>
      <h1 className="text-center font-dm-serif my-10 text-6xl text-gray-800">
        Welcome to Quantum University Store!
      </h1>
      <Outlet />
    </div>
  );
};

const Section1 = () => {
  // SELL/Rent
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("Electronics");
  const [type, setType] = useState("sell");
  const [duration, setDuration] = useState("");
  const [durationType, setDurationType] = useState("Days");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", itemName);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("category", category.toLowerCase());
    formData.append("type", type.toLowerCase());

    if (type === "rent") {
      formData.append("duration", duration);
      formData.append("durationType", durationType.toLowerCase());
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/product", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Success:", result);
      alert("Product added successfully!");
      setItemName("");
      setPrice(0);
      setDescription("");
      setImage(null);
      setCategory("Electronics");
      setType("sell");
      setDuration("");
      setDurationType("Days");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="flex w-4/5 bg-gray-200 mx-auto py-2 rounded-md my-10">
        <Link
          to="/store/sell"
          className="w-1/3 text-center bg-gray-50 py-1 mx-2 rounded-md"
        >
          Sell / Put on Rent
        </Link>
        <Link
          to="/store/buy"
          className="w-1/3 text-center py-1 mx-2 rounded-md"
        >
          Buy
        </Link>
        <Link
          to="/store/rent"
          className="w-1/3 text-center py-1 mx-2 rounded-md"
        >
          Rent
        </Link>
      </div>

      <form
        className="flex mx-auto my-10 max-w-md flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div>
          <div className="mb-2 block">
            <Label htmlFor="itemName" value="Item Name" />
          </div>
          <TextInput
            id="itemName"
            type="text"
            placeholder="Item Name"
            required
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="price" value="Item Price (in rupees)" />
          </div>
          <TextInput
            id="price"
            type="number"
            placeholder="eg. 1000"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="description" value="Item Description" />
          </div>
          <Textarea
            id="description"
            placeholder="Enter a description for the item"
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div id="fileUpload" className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="file" value="Item Image" />
          </div>
          <FileInput
            id="file"
            helperText="Please upload an image of the item"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="category" value="Item category" />
          </div>
          <Select
            id="category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Electronics</option>
            <option>Books</option>
            <option>Furniture</option>
            <option>Stationary</option>
            <option>Others</option>
          </Select>
        </div>

        <legend>Sell/rent</legend>
        <div className="flex items-center gap-2">
          <Radio
            id="sell"
            name="type"
            value="sell"
            checked={type === "sell"}
            onChange={() => setType("sell")}
          />
          <Label htmlFor="sell">sell</Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio
            id="rent"
            name="type"
            value="rent"
            checked={type === "rent"}
            onChange={() => setType("rent")}
          />
          <Label htmlFor="rent">rent</Label>
        </div>

        {type === "rent" && (
          <>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="duration" value="Duration" />
              </div>
              <TextInput
                id="duration"
                type="number"
                placeholder="1"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="durationType" value="Duration type" />
              </div>
              <Select
                id="durationType"
                required
                value={durationType}
                onChange={(e) => setDurationType(e.target.value)}
              >
                <option>Days</option>
                <option>Months</option>
                <option>Years</option>
                <option>Weeks</option>
              </Select>
            </div>
          </>
        )}

        <Button type="submit">Submit</Button>
      </form>
    </>
  );
};

const Section2 = () => {
  // BUY
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/getproducts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({ type: "sell" }),
        });
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <div className="flex w-4/5 bg-gray-200 mx-auto py-2 rounded-md my-10">
        <Link
          to="/store/sell"
          className="w-1/3 text-center py-1 mx-2 rounded-md"
        >
          Sell / Put on Rent
        </Link>
        <Link
          to="/store/buy"
          className="w-1/3 text-center py-1 bg-gray-50 mx-2 rounded-md"
        >
          Buy
        </Link>
        <Link
          to="/store/rent"
          className="w-1/3 text-center py-1 mx-2 rounded-md"
        >
          Rent
        </Link>
      </div>

      <div className="m-10 flex flex-wrap justify-center">
        {products.map((product) => (
          <BuyCard
            key={product._id}
            id={product._id}
            name={product.name}
            desc={product.description}
            img={product.image}
            price={product.price}
            cat={product.category}
            seller={product.seller.name}
          />
        ))}
      </div>
    </>
  );
};

const Section3 = () => {
  // RENT
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/getproducts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({ type: "rent" }),
        });
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <div className="flex w-4/5 bg-gray-200 mx-auto py-2 rounded-md my-10">
        <Link
          to="/store/sell"
          className="w-1/3 text-center py-1 mx-2 rounded-md"
        >
          Sell / Put on Rent
        </Link>
        <Link
          to="/store/buy"
          className="w-1/3 text-center py-1 mx-2 rounded-md"
        >
          Buy
        </Link>
        <Link
          to="/store/rent"
          className="w-1/3 text-center py-1 mx-2 bg-gray-50 rounded-md"
        >
          Rent
        </Link>
      </div>

      <div className="m-10 flex flex-wrap justify-center">
        {products.map((product) => (
          <RentCard
            key={product._id}
            id={product._id}
            name={product.name}
            desc={product.description}
            img={product.image}
            price={product.price}
            cat={product.category}
            seller={product.seller.name}
            duration={product.duration}
            durationType={product.durationType}
          />
        ))}
      </div>
    </>
  );
};

const BuyCard = ({ name, id, desc, img, price, cat, seller }) => {
  return (
    <div>
      <Card
        className="max-w-sm m-4"
        renderImage={() => (
          <img
            className="aspect-[3/2] rounded mx-auto"
            src={`http://localhost:3000/${img?.replace("public\\", "")}`}
            alt="image 1"
          />
        )}
      >
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {name}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">{desc}</p>
        <div>
          <span className="text-sm font-medium text-gray-500 dark:text-white">
            Category: {cat}
          </span>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-800 dark:text-white">
            Sold by: {seller}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            Rs. {price}
          </span>
          <Link
            to={`/product/details/${id}`}
            className="rounded-lg bg-cyan-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
          >
            See More
          </Link>
        </div>
      </Card>
    </div>
  );
};

const RentCard = ({ name, id, desc, img, price, cat, seller, duration, durationType }) => {
  return (
    <div>
      <Card
        className="max-w-sm m-4"
        renderImage={() => (
          <img
            className="aspect-[3/2] rounded mx-auto"
            src={`http://localhost:3000/${img?.replace("public\\", "")}`}
            alt="image 1"
          />
        )}
      >
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {name}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {desc}
        </p>
        <div>
          <span className="text-sm font-medium text-gray-500 dark:text-white">
            Category: {cat}
          </span>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-800 dark:text-white">
            Owner: {seller}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Rs. {price} /{duration + " " +durationType}
          </span>
          <Link
            to={`/product/details/${id}`}
            className="rounded-lg bg-cyan-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
          >
            See More
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Store;
export { Section1, Section2, Section3 };
