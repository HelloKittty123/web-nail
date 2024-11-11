export enum EnumStockDiaryType {
    /// <summary>
    /// Nhập kho
    /// </summary>
    ImportInternal = 0,

    /// <summary>
    /// Đề xuất vật tư
    /// </summary>
    Propose = 2,

    /// <summary>
    /// Xuất kho nội bộ chuyển từ nhân viên này sang nhân viên khác
    /// </summary>
    ExportInternal = 1,

    /// <summary>
    /// Xuất kho ra ngoài, lắp đặt cho khách hàng
    /// </summary>
    ExportOutter = 3,

    /// <summary>
    /// Chuyển kho giữa các kho
    /// </summary>
    Transfer = 4,

    /// <summary>
    /// Đề xuất vật tư nội bộ
    /// </summary>
    ProposeInternal = 5
}

export function GetExportType(type: string) {
    switch (type) {
        case "ImportInternal": return EnumStockDiaryType.ImportInternal;
        case "Propose": return EnumStockDiaryType.Propose;
        case "ExportInternal": return EnumStockDiaryType.ExportInternal;
        case "ExportOutter": return EnumStockDiaryType.ExportOutter;
        case "Transfer": return EnumStockDiaryType.Transfer;
        case "ProposeInternal": return EnumStockDiaryType.ProposeInternal;
        default: return EnumStockDiaryType.ImportInternal
    }
}

/// <summary>
/// Loại phiếu nhập xuất tiếng việt
/// </summary>
export function StockDiaryTypesVn() {
    return [{
        label: "Nhập kho nội bộ",
        value: EnumStockDiaryType.ImportInternal
    },
    {
        label: "Xuất kho nội bộ",
        value: EnumStockDiaryType.ExportInternal
    },
    {
        label: "Xuất kho lắp đặt, bảo hành",
        value: EnumStockDiaryType.ExportOutter
    },
    {
        label: "Đề xuất vật tư",
        value: EnumStockDiaryType.Propose
    }]
}


/// <summary>
/// Loại phiếu nhập xuất tiếng việt
/// </summary>
export function StockDiaryTypesEn() {
    return [{
        label: "Import internal",
        value: EnumStockDiaryType.ImportInternal
    },
    {
        label: "Export internal",
        value: EnumStockDiaryType.ExportInternal
    },
    {
        label: "Installation, warranty export",
        value: EnumStockDiaryType.ExportOutter
    },
    {
        label: "Propose from Unit",
        value: EnumStockDiaryType.Propose
    }]
}

/// <summary>
/// Trạng thái của phiếu nhập xuất
/// </summary>
export function StockDiaryStatus() {
    return [{
        number: 0,
        value: 'Pending',
        label: 'Chờ chấp nhận'
    },
    {
        number: 1,
        value: 'Approved',
        label: 'Đã chấp nhận'
    },
    {
        number: 2,
        value: 'Received',
        label: 'Đã nhận thiết bị'
    },
    {
        number: 3,
        value: 'Exported',
        label: 'Đã xuất thiết bị'
    },
    {
        number: 4,
        value: 'WaitReceived',
        label: 'Chờ nhận thiết bị'
    },

    ]
}