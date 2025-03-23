/**
 * Interface que representa os dados do formulário de checkout.
 */
export interface FormCheckout {
    /**
     * O primeiro nome do usuário.
     */
    firstName: string;

    /**
     * O sobrenome do usuário.
     */
    lastName: string;

    /**
     * O código postal do endereço do usuário.
     */
    zipCode: string;
}