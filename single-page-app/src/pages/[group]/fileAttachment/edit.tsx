import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

import { useDialog } from '@/components/dialog-popup';
import NavTabs from '@/components/nav-tabs';
import { useModel, useToastNotification, useZendroClient } from '@/hooks';
import { ModelLayout, PageWithLayout } from '@/layouts';

import { ExtendedClientError } from '@/types/errors';
import { AttributeValue, DataRecord } from '@/types/models';
import { RecordUrlQuery } from '@/types/routes';
import { parseErrorResponse } from '@/utils/errors';

import ModelBouncer from '@/zendro/model-bouncer';
import AttributesForm, {
  ActionHandler,
  computeDiffs,
} from '@/zendro/record-form';

import readOneFileAttachment from '@/overrides/readOneFileAttachment';
import { Dialog, Box, Tooltip, IconButton, TextField } from '@mui/material';

import mime from 'mime-types';
import { FileIcon, defaultStyles, DefaultExtensionType } from 'react-file-icon';
import { AttachFile } from '@mui/icons-material';

import updateFileAttachment from '@/overrides/updateFileAttachment';

interface AttachmentRecord {
  [key: string]: AttributeValue | DataRecord | File | undefined;
}

const Record: PageWithLayout<RecordUrlQuery> = () => {
  const classes = useStyles();
  const dialog = useDialog();
  const model = useModel('fileAttachment');
  const router = useRouter();
  const urlQuery = router.query as RecordUrlQuery;
  const { showSnackbar } = useToastNotification();
  const zendro = useZendroClient();
  const { t } = useTranslation();

  const filteredAttributes = model.attributes.filter(
    (x) =>
      x.name !== 'fileURL' &&
      x.name !== 'mimeType' &&
      x.name !== 'fileSize' &&
      x.name !== 'fileName'
  );

  /* STATE */
  const [selectedFile, setSelectedFile] = useState<File | undefined>();

  const [recordData, setRecordData] = useState<DataRecord>({
    [model.primaryKey]: urlQuery.id ?? null,
  });
  const [ajvErrors, setAjvErrors] = useState<Record<string, string[]>>();

  const [open, setOpen] = useState(false);
  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);

  const fileExtension = (recordData.id
    ? mime.extension(recordData['mimeType'] as string)
    : 'txt') as DefaultExtensionType;
  const isImage = recordData['mimeType']
    ? (recordData['mimeType'] as string).includes('image')
    : undefined;

  /* AUXILIARY */

  const parseAndDisplayErrorResponse = (
    error: Error | ExtendedClientError
  ): void => {
    const parsedError = parseErrorResponse(error);

    if (
      parsedError.genericError ||
      parsedError.networkError ||
      parsedError.graphqlErrors?.nonValidationErrors.length
    ) {
      showSnackbar(
        t('errors.server-error', { status: parsedError.status }),
        'error',
        parsedError
      );
    }

    // When creating or updating a record, display server validation errors
    if (parsedError.graphqlErrors?.validationErrors)
      setAjvErrors(parsedError.graphqlErrors.validationErrors);
  };

  /* ACTION HANDLERS */

  /**
   * Exit the form and go back to the model table page.
   */
  const handleOnCancel: ActionHandler = (formData) => {
    const confirmAbandonChanges = (): void => {
      dialog.openConfirm({
        title: t('dialogs.modified-info'),
        message: t('dialogs.leave-confirm'),
        okText: t('dialogs.ok-text'),
        cancelText: t('dialogs.cancel-text'),
        onOk: () => router.push(`/models/fileAttachment`),
      });
    };

    if (recordData && computeDiffs(formData, recordData) > 0)
      confirmAbandonChanges();
    else {
      router.push(`/models/fileAttachment`);
    }
  };

  /**
   * Delete the current record and return to the model table.
   */
  const handleOnDelete: ActionHandler = () => {
    dialog.openConfirm({
      title: t('dialogs.delete-confirm'),
      message: t('dialogs.delete-info', {
        recordId: urlQuery.id,
        modelName: 'fileAttachment',
      }),
      okText: t('dialogs.ok-text'),
      cancelText: t('dialogs.cancel-text'),
      onOk: async () => {
        if (!recordData) return;

        try {
          const query = zendro.queries['fileAttachment'].deleteOne.query;
          const variables = {
            [model.primaryKey]: recordData[model.primaryKey],
          };
          await zendro.request(query, { variables });
          router.push(`/models/fileAttachment`);
        } catch (error) {
          parseAndDisplayErrorResponse(error);
        }
      },
    });
  };

  /**
   * Navigate to the record details page.
   */
  const handleOnDetails: ActionHandler = () => {
    router.push(`/models/fileAttachment/details?id=${urlQuery.id}`);
  };

  /**
   * Reload page data.
   */
  const handleOnReload: ActionHandler = (formData) => {
    const revalidateData = async (): Promise<void> => {
      mutateRecord(undefined, true);
    };

    if (recordData) {
      const diffs = computeDiffs(formData, recordData);

      if (diffs > 0)
        dialog.openConfirm({
          title: t('dialogs.modified-info'),
          message: t('dialogs.reload-confirm'),
          okText: t('dialogs.ok-text'),
          cancelText: t('dialogs.cancel-text'),
          onOk: revalidateData,
        });
      else {
        revalidateData();
      }
    } else {
      revalidateData();
    }
  };

  /**
   * Submit the form values to the Zendro GraphQL endpoint. Triggers a revalidation.
   */
  const handleOnSubmit: ActionHandler = (formData, formStats) => {
    const dataRecord = formData.reduce<AttachmentRecord>(
      (acc, { name, value }) => ({ ...acc, [name]: value }),
      {}
    );

    if (selectedFile) {
      dataRecord['file'] = selectedFile;
    }
    console.log({ dataRecord });

    const submit = async (): Promise<void> => {
      try {
        const request = updateFileAttachment;

        const response = await zendro.request<Record<string, AttachmentRecord>>(
          request.query,
          { variables: dataRecord }
        );

        mutateRecord(response[request.resolver] as DataRecord);

        router.push(`/models/fileAttachment`);
      } catch (error) {
        parseAndDisplayErrorResponse(error);
      }
    };

    if (formStats.clientErrors > 0) {
      return dialog.openMessage({
        title: t('dialogs.validation-title'),
        message: t('dialogs.validation-info'),
      });
    }

    if (formStats.unset > 0) {
      const idMsg = urlQuery.id ? ` (id: ${urlQuery.id})` : '';
      return dialog.openConfirm({
        title: t('dialogs.submit-empty-info', { idMsg }),
        message: t('dialogs.submit-empty-confirm'),
        okText: t('dialogs.ok-text'),
        cancelText: t('dialogs.cancel-text'),
        onOk: submit,
      });
    }

    submit();
  };

  /* REQUEST */

  /**
   * Query data from the GraphQL endpoint.
   */
  const { mutate: mutateRecord } = useSWR<
    DataRecord | undefined,
    ExtendedClientError<Record<string, DataRecord>>
  >(
    [zendro, urlQuery.id],
    async () => {
      const request = readOneFileAttachment;
      const variables = {
        [model.primaryKey]: urlQuery.id,
      };
      const response = await zendro.request<Record<string, DataRecord>>(
        request.query,
        { variables }
      );
      if (response) return response[request.resolver];
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onSuccess: (data) => {
        setRecordData(
          data ?? {
            [model.primaryKey]: urlQuery.id ?? null,
          }
        );
        setAjvErrors(undefined);
      },
      onError: parseAndDisplayErrorResponse,
    }
  );

  console.log({ recordData });

  return (
    <ModelBouncer object="fileAttachment" action="update">
      <NavTabs
        id={urlQuery.id as string}
        active={router.asPath}
        tabs={[
          {
            type: 'link',
            label: 'attributes',
            href: router.asPath,
          },
          {
            type: 'group',
            label: 'associations',
            links: model.associations?.map((assoc) => ({
              type: 'link',
              label: assoc.name,
              href: `/models/fileAttachment/details/${assoc.name}?id=${urlQuery.id}`,
            })),
          },
        ]}
      />

      <AttributesForm
        attributes={filteredAttributes}
        className={classes.root}
        data={recordData}
        errors={ajvErrors}
        formId={router.asPath}
        formView="update"
        modelName="fileAttachment"
        actions={{
          cancel: handleOnCancel,
          delete:
            model.permissions.delete && model.apiPrivileges.delete
              ? handleOnDelete
              : undefined,
          read: model.permissions.read ? handleOnDetails : undefined,
          reload: handleOnReload,
          submit:
            model.permissions.update && model.apiPrivileges.update
              ? handleOnSubmit
              : undefined,
        }}
        info={
          recordData.fileURL &&
          recordData.urlThumbnail && (
            <div className={classes.info}>
              {isImage ? (
                <>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={handleOpen}
                    onKeyDown={handleOpen}
                    className={classes.image}
                  >
                    <img
                      alt="Not Found"
                      src={recordData.urlThumbnail as string}
                    ></img>
                  </div>
                  <Dialog open={open} onClose={handleClose} maxWidth="xl">
                    <a
                      href={recordData.fileURL as string}
                      download={recordData.fileName}
                    >
                      <img
                        alt="Not Found"
                        src={recordData.fileURL as string}
                      ></img>
                    </a>
                  </Dialog>
                </>
              ) : (
                <Tooltip
                  title={`${t('record-form.download-file')}`}
                  disableInteractive
                >
                  <a
                    href={recordData.fileURL as string}
                    download={recordData.fileName}
                  >
                    <Box maxWidth="3rem">
                      <FileIcon
                        extension={fileExtension}
                        {...defaultStyles[fileExtension]}
                      />
                    </Box>
                  </a>
                </Tooltip>
              )}
              <div className={classes.fileUpload}>
                <Tooltip
                  title={`${t('record-form.upload-file')}`}
                  disableInteractive
                >
                  <IconButton
                    className={classes.fileUploadButton}
                    component="label"
                  >
                    <input
                      style={{ display: 'none' }}
                      type="file"
                      onChange={(e) =>
                        setSelectedFile(
                          e.target.files && e.target.files?.length > 0
                            ? e.target.files[0]
                            : undefined
                        )
                      }
                    />
                    <AttachFile />
                  </IconButton>
                </Tooltip>
                {selectedFile && (
                  <TextField
                    disabled
                    variant="standard"
                    label={selectedFile.name}
                  />
                )}
              </div>
            </div>
          )
        }
      />
    </ModelBouncer>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      overflowY: 'auto',
    },
    image: {
      cursor: 'pointer',
    },
    fileUploadButton: {
      marginRight: '1rem',
      boxShadow: theme.shadows[4],
      backgroundColor: theme.palette.grey[300],
      // color: theme.palette.primary.dark,
      '&:hover': {
        backgroundColor: theme.palette.primary.background,
        color: theme.palette.primary.main,
      },
    },
    fileUpload: {
      marginTop: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    info: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'start',
      justifyContent: 'center',
    },
  })
);

Record.layout = ModelLayout;
export default Record;
