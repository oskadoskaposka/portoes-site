 import Link from "next/link";

 export default function ServicesPage() {
   return (
     <main
       style={{
         padding: "40px 20px",
         maxWidth: "800px",
         margin: "0 auto",
       }}
     >
       <h1>Services</h1>
       <p>
         We offer a full range of services including installation, maintenance
         and repairs for residential and commercial garage doors.
       </p>
       <ul>
         <li>
           <Link href="/services/homeowners">For Home Owners</Link>
         </li>
         <li>
           <Link href="/services/business">For Businesses</Link>
         </li>
       </ul>
     </main>
   );
 }