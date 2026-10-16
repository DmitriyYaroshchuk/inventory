import { redirect } from 'next/navigation';

function Home() {
  redirect('/orders');
}
export default Home;