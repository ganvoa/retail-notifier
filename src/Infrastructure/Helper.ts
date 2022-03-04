export const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const cleanString = (str: string): string => {
    return str.replace(/&quot;/g, '"')
        .replace(/&aacute;/g, 'á')
        .replace(/&Aacute;/g, 'Á')
        .replace(/&eacute;/g, 'é')
        .replace(/&Eacute;/g, 'É')
        .replace(/&iacute;/g, 'í')
        .replace(/&Iacute;/g, 'Í')
        .replace(/&oacute;/g, 'ó')
        .replace(/&Oacute;/g, 'Ó')
        .replace(/&uacute;/g, 'ú')
        .replace(/&Uacute;/g, 'Ú')
        .replace(/&ntilde;/g, 'ñ')
        .replace(/&Ntilde;/g, 'Ñ')
        .replace(/&amp;/g, '&')
        ;
} 