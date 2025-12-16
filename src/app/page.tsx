import { connection } from "next/server";


export default async function Home() {
  await connection();
  return (
   <div>hello</div>
  );
}
