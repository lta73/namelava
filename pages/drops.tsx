// pages/drops.tsx

import fs from 'fs';
import path from 'path';
import { GetStaticProps } from 'next';

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
        {domains.length > 0 ? (
          <ul className="space-y-2">
            {domains.map((item, index) => (
              <li key={index} className="flex justify-between border-b pb-1 text-sm">
                import Link from 'next/link'; // Đảm bảo có dòng này ở đầu file

<Link href=
                <span className="text-gray-400">{item.dropDate}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No gems available right now. Check back later!</p>
        )}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const filePath = path.join(process.cwd(), 'public', 'dropped.json');
  let domains: DomainItem[] = [];

  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    domains = JSON.parse(fileContent) as DomainItem[];

    domains.sort((a, b) => new Date(b.dropDate).getTime() - new Date(a.dropDate).getTime());
  }

  return {
    props: {
      domains,
    },
    revalidate: 3600, // regenerate every hour
  };
};
