import React from "react";
import Navbar from "../../components/navbar";
import { Category } from "./components/Categories";
import styles from "./styles/home.module.scss";
import { BlogList } from "./components/blogList";


export function HomePage() {
  return (
    <div>
      <Navbar />
      <div className={styles.blogContainer}>
        <Category />
        <BlogList/>
      </div>
    </div>
  );
}

