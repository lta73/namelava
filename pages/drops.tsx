import fs from 'fs';
import path from 'path';
import { GetStaticProps } from 'next';
import Link from 'next/link'; // 💡 Đặt đúng vị trí đầu file

type DomainItem = {
  domain: string;
  dropDate: string;
};

type Props = {
  domains: DomainItem[];
};

export default function Drops({ domains }: Props) {
  return (
    <div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">💎 Daily Dropped Gems</h1>
      <p className="mb-4 text-gray-600">Curated list of recently dropped domains worth a second look.</p>
      <div className="bg-white rounded shadow p-4 w-full max-w-2xl">
        <ul className="space-y-2">
          {domains.map((item, index) => (
            <li key={index} className="flex justify-between border-b pb-1 text-sm">
              <Link href={`/domain/${item.domain}`}>
                <a className="text-blue-600 hover:underline">{item.domain}</a>
              </Link>
              <span className="text-gray-400">{item.dropDate}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const filePath = path.join(process.cwd(), 'public', 'dropped.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const domains = JSON.parse(fileContent) as DomainItem[];

  // Optional: Sort by drop date, newest first
  domains.sort((a, b) => new Date(b.dropDate).getTime() - new Date(a.dropDate).getTime());

  return {
    props: {
      domains,
    },
    revalidate: 3600, // re-gen page every hour
  };
};
