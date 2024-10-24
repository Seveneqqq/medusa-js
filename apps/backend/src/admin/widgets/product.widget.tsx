import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container, Heading, Button, Select, Table, DropdownMenu, IconButton } from "@medusajs/ui";
import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons";
import { useState, useRef } from "react";

const ProductWidget = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [language, setLanguage] = useState<string>("");
    const [documentType, setDocumentType] = useState<string>("");
    const [uploadedFiles, setUploadedFiles] = useState<Array<{ file: File, language: string, documentType: string }>>([]);

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
        // Implement your edit logic here
    };

    const deleteDocument = () => {
        // Implement your delete logic here
    };

    const handleUpload = () => {
        if (files.length > 0 && language && documentType) {
            const newUploadedFiles = files.map(file => ({
                file,
                language,
                documentType,
            }));
            setUploadedFiles([...uploadedFiles, ...newUploadedFiles]);
            setFiles([]); // Clear file input after upload
        } else {
            alert("Please select files, language, and document type.");
        }
    };

    const handleSave = async () => {
        if (uploadedFiles.length > 0) {
            const formData = new FormData();

            let productUrl = location.href;
            let splittedUrl = productUrl.split('/');

            let id = splittedUrl[splittedUrl.length - 1];
            

            // Add files to FormData
            uploadedFiles.forEach(item => {
                formData.append('product_id', id); // Add product ID
                formData.append('files', item.file); // Add files
                formData.append('language', item.language); // Add language
                formData.append('documentType', item.documentType); // Add document type
            });

            try {
                // Upload files to Medusa server
                const response = await fetch('http://localhost:9000/files', {
                    method: 'POST',
                    body: formData,
                });

                console.log(formData);

                if (await response.ok) {
                    const result = await response.json();
                    console.log('Files saved successfully:', result);

                    // Reset uploadedFiles after saving
                    setUploadedFiles([]);
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

    const itemMenu = () => {
        return (
            <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                    <IconButton>
                        <EllipsisHorizontal />
                    </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    <DropdownMenu.Item className="gap-x-2" onClick={editDocument}>
                        <PencilSquare className="text-ui-fg-subtle" />
                        Edit
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item className="gap-x-2" onClick={deleteDocument}>
                        <Trash className="text-ui-fg-subtle" />
                        Delete
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu>
        );
    };

    return (
        <Container className="divide-y p-0">
            <div className="flex items-center justify-between px-6 py-4">
                <Heading level="h2">Documents</Heading>
            </div>

            {/* File upload section */}
            <div className="px-6 py-4">
                <Button variant="secondary" onClick={handleButtonClick}>Choose Files</Button>
                <input 
                    ref={fileInputRef}
                    type="file" 
                    multiple 
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
                        variant="primary" 
                        onClick={handleUpload}
                    >
                        Upload
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                </div>
            </div>

            {/* File table */}
            <div className="px-6 py-4">
                {uploadedFiles.length > 0 && (
                    <div>
                        <Table>
                            <Table.Row>
                                <Table.Cell>File Name</Table.Cell>
                                <Table.Cell>Language</Table.Cell>
                                <Table.Cell>Document Type</Table.Cell>
                                <Table.Cell>Preview</Table.Cell>
                            </Table.Row>
                            <Table.Body>
                                {uploadedFiles.map((item, index) => (
                                    <Table.Row key={index}>
                                        <Table.Cell>{item.file.name}</Table.Cell>
                                        <Table.Cell>{item.language}</Table.Cell>
                                        <Table.Cell>{item.documentType}</Table.Cell>
                                        <Table.Cell>
                                            {item.file.type.startsWith("image/") && (
                                                <img 
                                                    src={URL.createObjectURL(item.file)} 
                                                    alt={item.file.name} 
                                                    className="w-32 h-32 object-cover" 
                                                />
                                            )}
                                            {item.file.type === "application/pdf" && (
                                                <a 
                                                    href={URL.createObjectURL(item.file)} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500"
                                                >
                                                    View PDF
                                                </a>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>{itemMenu()}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                )}
            </div>
        </Container>
    );
};

export const config = defineWidgetConfig({
    zone: "product.details.after",
});

export default ProductWidget;
