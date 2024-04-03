import * as Yup from 'yup';


export const USER_VALIDATION = Yup.object().shape({
    address: Yup.string(),
    phone: Yup.number()
        .typeError('Harus berupa angka')
        .positive('Nomoer telepon tidak boleh negatif')
        .integer('Nomor telepon tidak boleh desimal') 
});

export const SUGGEST_VALIDATION = Yup.object().shape({
    title: Yup.string().required('Judul harus diisi'),
    author: Yup.string().optional(),
    publishercode : Yup.string().optional(),
    note: Yup.string().optional(),
})


