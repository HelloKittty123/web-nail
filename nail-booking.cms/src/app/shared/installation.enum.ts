
export enum EnumCustomerType {
    Personal = 1,
    Company = 2
}

export function CustomerTypesVn() {
    return [{
        label: "Cá nhân",
        value: EnumCustomerType.Personal
    },
    {
        label: "Công ty",
        value: EnumCustomerType.Company
    }]
}

export function CustomerTypesEn() {
    return [{
        label: "Personal",
        value: EnumCustomerType.Personal
    },
    {
        label: "Company",
        value: EnumCustomerType.Company
    }]
}


/// <summary>
/// Loại phiếu lắp đặt
/// </summary>

export enum EnumInstallationType {
    /// <summary>
    /// Lắp đặt
    /// </summary>
    Installation = 1,

    /// <summary>
    /// Bảo hành
    /// </summary>
    Warranty = 2
}

export function InstallationTypesVn() {
    return [{
        label: "Lắp đặt",
        value: EnumInstallationType.Installation
    },
    {
        label: "Bảo hành",
        value: EnumInstallationType.Warranty
    }]
}

export function UsageStatusVn() {
    return [{
        label: "Bán hẳn",
        value: 0
    },
    {
        label: "Cho mượn 3 năm",
        value: 2
    },
    {
        label: "Cho mượn 5 năm",
        value: 3
    },
    {
        label: "Vo thời hạn",
        value: 4
    }, {
        label: "Khác",
        value: 5
    }
    ]
}