export const visitStats = {
  today: 7891,
  week: 102891,
  month: 340891,
  all: 1287899,
};

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    const value = num / 1000000;
    return value % 1 === 0 ? `${value}M` : `${value.toFixed(1)}M`;
  }
  if (num >= 1000) {
    const value = num / 1000;
    return value % 1 === 0 ? `${value}k` : `${value.toFixed(1)}k`;
  }
  return num.toString();
}

export function VisitStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div className="bg-blue-50 rounded-xl p-6 text-center">
        <p className="text-gray-600 mb-2">ມື້ນີ້</p>
        <p className="text-3xl font-bold text-blue-600">{formatNumber(visitStats.today)}</p>
      </div>
      <div className="bg-green-50 rounded-xl p-6 text-center">
        <p className="text-gray-600 mb-2">ອາທິດນີ້</p>
        <p className="text-3xl font-bold text-green-600">{formatNumber(visitStats.week)}</p>
      </div>
      <div className="bg-orange-50 rounded-xl p-6 text-center">
        <p className="text-gray-600 mb-2">ເດືອນນີ້</p>
        <p className="text-3xl font-bold text-orange-600">{formatNumber(visitStats.month)}</p>
      </div>
      <div className="bg-purple-50 rounded-xl p-6 text-center">
        <p className="text-gray-600 mb-2">ທັງໝົດ</p>
        <p className="text-3xl font-bold text-purple-600">{formatNumber(visitStats.all)}</p>
      </div>
    </div>
  );
}
