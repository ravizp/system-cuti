export default function LeavePage() {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-4 mb-6">
        <h3>PT. LAPI LABORATORIES</h3>
        <h1 className="text-2xl font-semibold">Cuti</h1>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Employee Details */}
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="border border-gray-300 p-3 w-1/3 bg-gray-50">
                Nama Karyawan
              </td>
              <td className="border border-gray-300 p-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="border p-1 flex-1"
                    placeholder="Pilih Karyawan"
                  />
                  <button className="bg-blue-500 text-white px-3 py-1 rounded">
                    Cari
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3 bg-gray-50">
                Departemen
              </td>
              <td className="border border-gray-300 p-3">(Auto)</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3 bg-gray-50">
                Untuk tanggal
              </td>
              <td className="border border-gray-300 p-3">
                <div className="flex items-center gap-2">
                  Dari <input type="date" className="border p-1" /> s/d{" "}
                  <input type="date" className="border p-1" />
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3 bg-gray-50">
                Cuti yang diperlukan
              </td>
              <td className="border border-gray-300 p-3">
                <span>.... hari (Auto)</span>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3 bg-gray-50">
                Keperluan
              </td>
              <td className="border border-gray-300 p-3">
                <textarea className="w-full border p-2" rows={3}></textarea>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Signatures */}
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="border border-gray-300 p-3 text-center w-1/3">
                Pemohon,
              </td>
              <td className="border border-gray-300 p-3 text-center w-1/3">
                Mengetahui,
              </td>
              <td className="border border-gray-300 p-3 text-center w-1/3">
                Menyetujui,
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3 h-24"></td>
              <td className="border border-gray-300 p-3 h-24"></td>
              <td className="border border-gray-300 p-3 h-24"></td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3 text-center">
                Tanda tangan/tgl.
              </td>
              <td className="border border-gray-300 p-3 text-center">
                <div>Tanda tangan/tgl.</div>
                <div className="font-semibold">Supervisor Departemen</div>
              </td>
              <td className="border border-gray-300 p-3 text-center">
                <div>Tanda tangan/tgl.</div>
                <div className="font-semibold">Manager Departemen</div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* HR Section */}
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td
                colSpan={2}
                className="border border-gray-300 p-3 font-semibold bg-gray-50">
                Departemen HR
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3 w-2/3">Sisa cuti</td>
              <td className="border border-gray-300 p-3">12 hari</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3">
                Cuti yang akan diambil
              </td>
              <td className="border border-gray-300 p-3">3 hari</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3">Total sisa cuti</td>
              <td className="border border-gray-300 p-3">9 hari</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3 h-24"></td>
              <td className="border border-gray-300 p-3 text-center">
                <div className="mt-12">HR Manager</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
