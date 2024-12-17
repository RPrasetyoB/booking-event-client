import img from "../../public/assets/not-found.png";

export default function Notfound() {
  return (
    <div className="flex h-screen w-screen">
      <img src={img} alt="not found image" className="m-auto" />
    </div>
  );
}
