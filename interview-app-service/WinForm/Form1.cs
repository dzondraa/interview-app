using BusinessLayer;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace WinForm
{
    public partial class Form1 : Form
    {
        int selector = 0;
        String[] _urls;
        private bool _searching = false;
        private DocExtractor _extractor = null;

        public Form1()
        {
            InitializeComponent();
            progressBar1.Style = ProgressBarStyle.Marquee;
            progressBar1.Visible = false;
            progressBar1.MarqueeAnimationSpeed = 10;
            textBox2.ScrollBars = ScrollBars.Vertical;
        }

        private async void button1_Click(object sender, EventArgs e)
        {
            int size = -1;
            DialogResult result = folderBrowserDialog1.ShowDialog(); // Show the dialog.
            if (result == DialogResult.OK) // Test result.
            {
                textBox1.Text = folderBrowserDialog1.SelectedPath;

            }
        }

        private async Task<string> GetDocuments()
        {
            try {
                var res = await Task.Run(() => DocService.RunThroughFolders(folderBrowserDialog1.SelectedPath, this.textBox3.Text, (int)numericUpDown1.Value));
                return res; 
            } 
            catch(Exception ex1)
            {
                return "";
            }
            
        }

        private void button2_Click(object sender, EventArgs e)
        {
            try
            {
                if (_extractor != null)
                {
                    selector = selector - 1 >= 0 ? selector = selector - 1 : selector;
                    _extractor = new DocExtractor(DocService.GetDocContent(_urls[selector]));
                    ChangeResultView();
                }
            }
            catch (Exception e1)
            {

            }
            
        }

        private void button3_Click(object sender, EventArgs e)
        {
            try
            {
                if (_extractor != null)
                {
                    selector = selector + 1 < _urls.Length ? selector = selector + 1 : selector;
                    _extractor = new DocExtractor(DocService.GetDocContent(_urls[selector]));
                    ChangeResultView();
                }
            }
            catch (Exception ex2)
            {

            }

            
        }

        private void toggle_search()
        {
            _searching = !_searching;
            this.button2.Visible = !this.button2.Visible;
            this.button3.Visible = !this.button3.Visible;
            this.progressBar1.Visible = !this.progressBar1.Visible;
            this.label1.Visible = !this.label1.Visible;

        }

        private void sectionComboBox_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (_extractor != null)
            {
                try
                {
                    ChangeResultView();
                }

                catch (Exception exx)
                {

                }
                

            }
        }

        private void ChangeResultView()
        {
            string value = this.sectionComboBox.Items[sectionComboBox.SelectedIndex].ToString();
            try
            {



                if (value == "Key tech skills")
                {
                    this.textBox2.Text = _extractor.getKeySkills();
                }
                else if (value == "About")
                {
                    this.textBox2.Text = _extractor.getProfessionalSummary();

                }
                else if (value == "Responsibilities")
                {
                    this.textBox2.Text = "";
                }
                this.label2.Text = value.ToUpper();
            }
            catch (Exception e)
            {

            }

        }

        private async void button4_Click(object sender, EventArgs e)
        {
            toggle_search();
            var res = await this.GetDocuments();
            _urls = res.Split("\n");
            //textBox2.Text = res;
            toggle_search();

            _extractor = new DocExtractor(DocService.GetDocContent(_urls[0]));
            try
            {
                this.textBox2.Text = _extractor.getProfessionalSummary();
            }
            catch (Exception ex)
            {
            }
        }

        private void button5_Click(object sender, EventArgs e)
        {
            new BuilderForm(_extractor);
        }
    }
}
