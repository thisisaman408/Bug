import { Grid } from "@mui/material";
import SalesCard from "../components/SalesCard";
import SalesChart from "../components/SalesChart";

const SellerHomePage = () => {
  const salesData = [
    {
      title: "Weekly Sales",
      total: 71,
      color: "primary",
      icon: "ant-design:carry-out-filled",
    },
    {
      title: "Added to Cart",
      total: 23,
      color: "success",
      icon: "ant-design:shopping-cart-outlined",
    },
    {
      title: "Ongoing Orders",
      total: 17,
      color: "warning",
      icon: "material-symbols:data-exploration",
    },
    {
      title: "Cancelled Orders",
      total: 13,
      color: "error",
      icon: "material-symbols:free-cancellation-rounded",
    },
  ];
  return (

    // not a bug but improvement in code structure 
    <Grid container spacing={3} sx={{ padding: "9px" }}>
      {salesData.map((data, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <SalesCard
            title={data.title}
            total={data.total}
            color={data.color}
            icon={data.icon}
          />
        </Grid>
      ))}
      <Grid item xs={12} lg={6}>
        <SalesChart type="line" />
      </Grid>
      <Grid item xs={12} lg={6}>
        <SalesChart type="bar" />
      </Grid>
    </Grid>
  );
};

export default SellerHomePage;