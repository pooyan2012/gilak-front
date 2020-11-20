import React from "react";
import Layout from "./Layout";
import { API } from "../config";

const Home = () => (
  <Layout title="Homepage" description="This is homepage description">
    {API}
  </Layout>
);

export default Home;
