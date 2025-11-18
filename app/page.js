

import Banner from "./Components/Share/Banner";
import CategoryBanner from "./Components/Share/CatgoryBanner";
import PackageType from "./Components/Share/PackageType";
import ProductsPage from "./products/page";


export default function Home() {
  return (
    <>
<Banner /> 

 <PackageType/>
 <CategoryBanner />
<ProductsPage/>
    </>
  );
}
