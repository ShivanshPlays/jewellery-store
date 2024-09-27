import { Color} from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/colors`;

// console.log(URL);

const getColors = async (): Promise<Color[]> => {
  const res = await fetch(URL);
  return res.json();
};

export default getColors;
