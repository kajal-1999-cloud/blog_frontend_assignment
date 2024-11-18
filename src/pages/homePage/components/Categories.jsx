import styles from "../styles/category.module.scss";
import Slider from "react-slick";
import math from "../../../assets/math.jpeg";
import physics from "../../../assets/physics.jpeg";

export const Category = () => {
    const Content = [
      {
        image: math,
        tags: "mathmathmathmathmathmathmathmathmathmath",
      },
      {
        image: physics,
        tags: "Physics",
      },
  
      {
        image: math,
        tags: "IIT",
      },
      {
        image: physics,
        tags: "NIT",
      },
  
     
    ];
  
    const settings = {
      className: "center",
      centerMode: true,
      infinite: true,
      centerPadding: "40px",
      margin: "20px",
      slidesToShow: 3,
      speed: 500,
    };
    return (
      <div className={styles.categoryContainer}>
         <div>
         <h3>Top Category</h3>
          <select  value="select category">
              <option value="select category">Select Category</option>
          </select>
         </div>
        <div className={`slider-container  ${styles.sliderContainer}`}>
          <Slider {...settings}>
            {Content.map((item) => {
              return (
                <div className={styles.sliderImage}>
                  <div>
                    <img src={item.image} alt="" />
                    <span className={styles.tags}>{item.tags.toUpperCase()}</span>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    );
  };
  