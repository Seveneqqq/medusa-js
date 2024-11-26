import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container, Heading, Button, Select, Table, DropdownMenu, IconButton,  Toaster, toast } from "@medusajs/ui";
import { EllipsisHorizontal, PencilSquare, Trash, ComputerDesktop, MagnifyingGlass, CloudArrowUp, CheckMini } from "@medusajs/icons";
import { useState, useRef, useEffect } from "react";
import { FileModal } from "../components/custom/file-modal";
import { FocusModal } from "@medusajs/ui";

const ProductWidget = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [language, setLanguage] = useState<string>("");
    const [productAttachments, setProductAttachments] = useState<any>([]);
    const [documentType, setDocumentType] = useState<string>("");
    const [uploadedFiles, setUploadedFiles] = useState<Array<{ fileName: string, language: string, documentType: string }>>([]);
    const [relatedFiles, setRelatedFiles] = useState<Array<{
        id: number,
        file_id: number,
        file_name: string,
        language: string,
        document_type: string,
        created_at: string,
        updated_at: string,
        deleted_at: null | string
    }>>([]);
    const [selectedFiles, setSelectedFiles] = useState<Array<{ file_name: string, language: string, document_type: string }>>([]); 
    const [modalOpen, setModalOpen] = useState(false); 
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFiles(Array.from(event.target.files));
        }
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const editDocument = () => {
        // todo
        //modal z wyswietleniem wszystkich informacji
    };

    const deleteDocument = (index: number, type: string) => {
        if (type === "related") {
            dropFileFromDB(index);
        } else {
            setUploadedFiles((prevFiles) => {
                const updatedFiles = [...prevFiles];
                updatedFiles.splice(index, 1);
                return updatedFiles;
            });
        }
        
        toast.info("Data saved successfully.", {
            description: "Document has been deleted.",
        });
        fetchData();
    };

    const dropFileFromDB = async (index: number) => {
        try {
 
            console.log(productAttachments[index].id);
            let id = productAttachments[index].id;
            

            let response = await fetch(`http://localhost:9000/admin/attachments`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    id: id,
                }),
            });

            let result = await response.json();
            console.log(result);

            setRelatedFiles((prevFiles) => {
                const updatedFiles = [...prevFiles];
                updatedFiles.splice(index, 1);
                return updatedFiles;
            });

        } catch (error) {
            console.log({ Error: error });
        }
    };

    const fetchData = async () => {
        try {

            const response = await fetch(`http://localhost:9000/admin/attachments/${getProductIdFromUrl()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            setRelatedFiles(result.attachments);
            setProductAttachments(result.product_attachments);
            console.log(result);
            console.log('Updated');
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData(); 
    }, []); 

    const handleUpload = () => {
        if (files.length > 0 && language && documentType) {
            const newUploadedFiles = files.map(file => ({
                fileName: file.name,
                language,
                documentType,
            }));
            setUploadedFiles([...uploadedFiles, ...newUploadedFiles]);
             
        } else {
            alert("Please select files, language, and document type.");
        }
    };

    const saveLocal = async () => {
        
        const input = document.getElementById('fileInput') as HTMLInputElement;
    
        if (!input || !input.files || input.files.length === 0) {
            console.error("No files selected.");
            return;
        }
    
        const formData = new FormData();
        Array.from(input.files).forEach((file) => {
            formData.append('files', file); 
        });
    
        const productId = await getProductIdFromUrl();

        try {
            const response = await fetch(`http://localhost:9000/admin/attachments/${productId}/save-file`, {
                method: 'POST',
                body: formData,
                credentials: 'include', 
            });
    
            if (!response.ok) {
                throw new Error('File upload failed');
            }
    
            const result = await response.json();
            console.log('Upload successful:', result);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };
    
    const handleSave = async () => {
        if (uploadedFiles.length > 0) {
            const dataToSend = {
                product_id: getProductIdFromUrl(),
                attachments: uploadedFiles.map(item => ({
                    file_name: item.fileName,
                    language: item.language,
                    document_type: item.documentType,
                })),
            };

            const productId = await getProductIdFromUrl();

            try {
                const response = await fetch(`http://localhost:9000/admin/attachments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', 
                    body: JSON.stringify({
                        attachments: dataToSend.attachments,
                        product_id: productId
                    })
                });

                if (response.ok) {
                    const result = await response.json();
                    saveLocal();
                    setFiles([]);
                    setUploadedFiles([]);
                    fetchData();
                } else {
                    console.error('File save failed:', response.statusText);
                }
            } catch (error) {
                console.error('Error saving files:', error);
            }
        } else {
            alert("No files to save.");
        }
    };

    const getProductIdFromUrl = () => {
        let productUrl = location.href;
        let splittedUrl = productUrl.split('/');
        return splittedUrl[splittedUrl.length - 1];
    };

    const itemMenu = (index: number, type: string) => {
        return (
            <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                    <IconButton>
                        <EllipsisHorizontal />
                    </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    {/* <DropdownMenu.Item className="gap-x-2" onClick={editDocument}>
                        <PencilSquare className="text-ui-fg-subtle" />
                        Edit
                    </DropdownMenu.Item> */}
                    {/* <DropdownMenu.Separator /> */}
                    <DropdownMenu.Item className="gap-x-2" onClick={() => deleteDocument(index,type)}>
                        <Trash className="text-ui-fg-subtle" />
                        Delete
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu>
        );
    };

    const handleFileSelection = (selectedFiles: Array<{ file_name: string, language: string, document_type: string }>) => {
        setSelectedFiles(selectedFiles);
        setModalOpen(false);
        fetchData();
    };

    const Modal = () => {
        return (
            <FocusModal open={modalOpen} onOpenChange={setModalOpen}>
                <FocusModal.Trigger asChild>
                    <Button variant="secondary"><MagnifyingGlass />Find files</Button>
                </FocusModal.Trigger>
                <FocusModal.Content>
                    <FocusModal.Header>
                    </FocusModal.Header>
                    <FocusModal.Body className="flex flex-col items-center py-14">
                        <FileModal onClose={() => {
                            fetchData();
                            setModalOpen(false)
                        }} setSelectedFiles={handleFileSelection} />
                    </FocusModal.Body>
                </FocusModal.Content>
            </FocusModal>
        )
    }

    return (
        <Container className="divide-y p-0">
            <Toaster />
            <div className="flex items-center justify-between px-6 py-4">
                <Heading level="h2">Attachments</Heading>
            </div>

            {/* File upload section */}
            <div className="px-6 py-4">
                <div className="flex flex-row gap-5">
                    <Button variant="secondary" onClick={handleButtonClick}><ComputerDesktop />Choose Files</Button>
                    <Modal />
                </div>
                <input 
                    ref={fileInputRef}
                    id="fileInput" 
                    type="file" 
                    accept="image/*,application/pdf"
                    onChange={handleFileChange} 
                    className="hidden" 
                />
            </div>

            <div className="px-6 py-4">
                <div className="mb-4">
                    <label className="block mb-2">Select Language:</label>
                    <Select 
                        name="language"
                        value={language} 
                        onValueChange={setLanguage} 
                    >
                        <Select.Trigger>
                            <Select.Value placeholder="Select a language" />
                        </Select.Trigger>
                        <Select.Content className="z-50">
                            <Select.Item value="PL">Polish (PL)</Select.Item>
                            <Select.Item value="EN">English (EN)</Select.Item>
                            <Select.Item value="DE">German (DE)</Select.Item>
                        </Select.Content>
                    </Select>
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Select Document Type:</label>
                    <Select 
                        name="documentType"
                        value={documentType} 
                        onValueChange={setDocumentType} 
                    >
                        <Select.Trigger>
                            <Select.Value placeholder="Select a document type" />
                        </Select.Trigger>
                        <Select.Content className="z-50">
                            <Select.Item value="instruction">Instruction</Select.Item>
                            <Select.Item value="certificate">Certificate</Select.Item>
                            <Select.Item value="compliance_card">Compliance Card</Select.Item>
                            <Select.Item value="catalog_card">Catalog Card</Select.Item>
                            <Select.Item value="other">Other</Select.Item>
                        </Select.Content>
                    </Select>
                </div>
                <div className="flex flex-row gap-5">
                    <Button 
                        variant="secondary" 
                        onClick={handleUpload}
                    >
                        <CloudArrowUp />
                        Upload
                    </Button>
                </div>
            </div>

            {uploadedFiles.length > 0 && (
                <div className="px-6 py-4">
                    <Heading level="h3">Uploaded Files</Heading>
                    <div>    
                        <Table>
                            <Table.Row>
                                <Table.Cell>File Name</Table.Cell>
                                <Table.Cell>Language</Table.Cell>
                                <Table.Cell>Document Type</Table.Cell>
                                <Table.Cell>Actions</Table.Cell>
                            </Table.Row>
                            <Table.Body>
                                {uploadedFiles.map((item, index) => (
                                    <Table.Row key={index}>
                                        <Table.Cell id={`document-name-${index}`}>{item.fileName}</Table.Cell>
                                        <Table.Cell>{item.language}</Table.Cell>
                                        <Table.Cell>{item.documentType}</Table.Cell>
                                        <Table.Cell>{itemMenu(index,'uploaded')}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            )}

            {relatedFiles.length > 0 && (
                <div className="px-6 py-4" style={{ width: '100%', maxHeight: '450px', overflowY: 'auto' }}>
                    <Heading level="h3">Related files</Heading>
                    <div>    
                        <Table>
                            <Table.Row>
                                <Table.Cell>File Name</Table.Cell>
                                <Table.Cell>Language</Table.Cell>
                                <Table.Cell>Document Type</Table.Cell>
                                <Table.Cell>Actions</Table.Cell>
                            </Table.Row>
                            <Table.Body>
                                {relatedFiles.map((item:any, index) => (
                                    <Table.Row key={index}>
                                        <Table.Cell>{item.file_name}</Table.Cell>
                                        <Table.Cell>{item.language}</Table.Cell>
                                        <Table.Cell>{item.document_type}</Table.Cell>
                                        <Table.Cell>{itemMenu(index,'related')}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            )}
            <div className="px-6 py-4">
                <Button 
                    variant="primary" 
                    onClick={handleSave}>
                    <CheckMini />
                    Save
                </Button>
            </div>
        </Container>
    );
};

export const config = defineWidgetConfig({
    zone: "product.details.after",
});

export default ProductWidget;
